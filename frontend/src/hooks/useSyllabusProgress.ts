import { useState, useEffect, useCallback, useRef } from "react";
import { getSyllabusData } from "@/data/syllabus";
import {
  getSyllabusProgress,
  toggleSyllabusObjective,
  bulkSetSyllabusProgress,
} from "@/api/syllabus";
import { useAuth } from "@/lib/auth-context";

const STORAGE_KEY = "examglow_syllabus_progress";

type ProgressStore = Record<string, Record<string, boolean>>;

function loadLocalStore(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}

function saveLocalStore(store: ProgressStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function useSyllabusProgress(subjectId: string) {
  const { user } = useAuth();
  const [store, setStore] = useState<ProgressStore>(() => loadLocalStore());
  const [dbLoaded, setDbLoaded] = useState(false);
  const migrated = useRef(false);

  // Load from DB when user is available
  useEffect(() => {
    if (!user) return;

    getSyllabusProgress().then((rows) => {
      const dbStore: ProgressStore = {};
      for (const row of rows) {
        if (!dbStore[row.subject_id]) dbStore[row.subject_id] = {};
        dbStore[row.subject_id][row.objective_id] = row.completed === true || (row.completed as any) === 1;
      }

      // Migrate localStorage → DB on first load
      if (!migrated.current) {
        migrated.current = true;
        const local = loadLocalStore();
        const toMigrate: { subjectId: string; objectiveId: string; completed: boolean }[] = [];

        for (const [sid, objs] of Object.entries(local)) {
          for (const [oid, done] of Object.entries(objs)) {
            // Only migrate if DB doesn't already have this entry
            if (done && !dbStore[sid]?.[oid]) {
              toMigrate.push({ subjectId: sid, objectiveId: oid, completed: true });
            }
          }
        }

        if (toMigrate.length > 0) {
          bulkSetSyllabusProgress(toMigrate).then(() => {
            // Merge migrated data into dbStore
            for (const item of toMigrate) {
              if (!dbStore[item.subjectId]) dbStore[item.subjectId] = {};
              dbStore[item.subjectId][item.objectiveId] = item.completed;
            }
            setStore(dbStore);
          });
        } else {
          setStore(dbStore);
        }
      } else {
        setStore(dbStore);
      }

      setDbLoaded(true);
    }).catch(() => {
      // Fall back to localStorage if DB fails
      setStore(loadLocalStore());
      setDbLoaded(true);
    });
  }, [user]);

  // Cross-tab sync for localStorage (when not logged in)
  useEffect(() => {
    if (user) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(loadLocalStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  const completed: Record<string, boolean> = store[subjectId] ?? {};

  const toggleObjective = useCallback(
    async (objectiveId: string) => {
      const current = !!(store[subjectId]?.[objectiveId]);
      const next = !current;

      // Optimistic update
      setStore((prev) => {
        const updated: ProgressStore = {
          ...prev,
          [subjectId]: { ...(prev[subjectId] ?? {}), [objectiveId]: next },
        };
        if (!user) saveLocalStore(updated);
        return updated;
      });

      // Persist to DB if logged in, otherwise localStorage
      if (user) {
        await toggleSyllabusObjective(subjectId, objectiveId, next).catch(() => {
          // Revert on failure
          setStore((prev) => ({
            ...prev,
            [subjectId]: { ...(prev[subjectId] ?? {}), [objectiveId]: current },
          }));
        });
      } else {
        saveLocalStore({ ...store, [subjectId]: { ...(store[subjectId] ?? {}), [objectiveId]: next } });
      }
    },
    [subjectId, store, user]
  );

  const markComplete = useCallback(
    async (objectiveId: string) => {
      setStore((prev) => {
        const updated: ProgressStore = {
          ...prev,
          [subjectId]: { ...(prev[subjectId] ?? {}), [objectiveId]: true },
        };
        if (!user) saveLocalStore(updated);
        return updated;
      });

      if (user) {
        await toggleSyllabusObjective(subjectId, objectiveId, true).catch(() => {});
      }
    },
    [subjectId, user]
  );

  const isComplete = useCallback(
    (objectiveId: string) => !!(store[subjectId]?.[objectiveId]),
    [store, subjectId]
  );

  const getProgress = useCallback(
    (sid: string): number => {
      const syllabusData = getSyllabusData(sid);
      if (!syllabusData) return 0;
      const subObjs = syllabusData.objectives.flatMap((o) => o.subObjectives ?? []);
      if (subObjs.length === 0) return 0;
      const done = subObjs.filter((s) => store[sid]?.[s.id]).length;
      return Math.round((done / subObjs.length) * 100);
    },
    [store]
  );

  const progress = getProgress(subjectId);

  return { completed, toggleObjective, markComplete, isComplete, progress, getProgress, dbLoaded };
}
