import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const historySubject: Subject = {
  id: "history-0470",
  name: "History",
  code: "0470",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "History – Cambridge IGCSE (0470)",
};

const historyObjectives: SyllabusObjective[] = [
  {
    id: "hist-1", subjectId: "history-0470", code: "1",
    title: "Were the Peace Treaties of 1919-1923 Fair?", description: "Terms and consequences of Versailles and other peace treaties", order: 1,
    subObjectives: [
      { id: "hist-1-1", subjectId: "history-0470", code: "1.1", title: "Treaty of Versailles", description: "The motives of the Big Three (Wilson, Lloyd George, Clemenceau) and terms of the treaty", order: 1, parentId: "hist-1" },
      { id: "hist-1-2", subjectId: "history-0470", code: "1.2", title: "Reactions and Other Treaties", description: "German reactions to Versailles; terms of Saint-Germain, Trianon, Neuilly, and Sèvres", order: 2, parentId: "hist-1" },
    ],
  },
  {
    id: "hist-2", subjectId: "history-0470", code: "2",
    title: "To What Extent Was the League of Nations a Success?", description: "Aims, structure, and successes/failures of the League in the 1920s and 1930s", order: 2,
    subObjectives: [
      { id: "hist-2-1", subjectId: "history-0470", code: "2.1", title: "Structure and 1920s Disputes", description: "Aims, membership, and organization of the League; success in humanitarian work and 1920s border disputes", order: 1, parentId: "hist-2" },
      { id: "hist-2-2", subjectId: "history-0470", code: "2.2", title: "1930s Failures", description: "The impact of the Great Depression; the Manchurian Crisis and Abyssinian Crisis", order: 2, parentId: "hist-2" },
    ],
  },
  {
    id: "hist-3", subjectId: "history-0470", code: "3",
    title: "Why Had International Peace Collapsed by 1939?", description: "Hitler's foreign policy, the failure of appeasement, and the road to WWII", order: 3,
    subObjectives: [
      { id: "hist-3-1", subjectId: "history-0470", code: "3.1", title: "Hitler's Foreign Policy", description: "Aims of Hitler's policy; rearmament, Saar, Rhineland, Anschluss, and Sudetenland", order: 1, parentId: "hist-3" },
      { id: "hist-3-2", subjectId: "history-0470", code: "3.2", title: "Appeasement and War", description: "The Munich Agreement and appeasement policy; Nazi-Soviet Pact; invasion of Poland", order: 2, parentId: "hist-3" },
    ],
  },
  {
    id: "hist-4", subjectId: "history-0470", code: "4",
    title: "Who Was to Blame for the Cold War?", description: "Breakdown of the wartime alliance, Soviet expansion, containment, and division of Europe", order: 4,
    subObjectives: [
      { id: "hist-4-1", subjectId: "history-0470", code: "4.1", title: "Origins of the Cold War", description: "Yalta and Potsdam conferences; Iron Curtain speech; Truman Doctrine and Marshall Plan", order: 1, parentId: "hist-4" },
      { id: "hist-4-2", subjectId: "history-0470", code: "4.2", title: "Berlin Blockade and NATO", description: "The Berlin Blockade and Airlift; creation of NATO and the Warsaw Pact", order: 2, parentId: "hist-4" },
    ],
  },
  {
    id: "hist-5", subjectId: "history-0470", code: "5",
    title: "How Effectively Did the USA Contain the Spread of Communism?", description: "Case studies: Korean War, Cuban Missile Crisis, and Vietnam War", order: 5,
    subObjectives: [
      { id: "hist-5-1", subjectId: "history-0470", code: "5.1", title: "Korean War", description: "Causes, main events, and consequences of the UN/US intervention in Korea", order: 1, parentId: "hist-5" },
      { id: "hist-5-2", subjectId: "history-0470", code: "5.2", title: "Cuban Missile Crisis", description: "Fidel Castro's revolution, Bay of Pigs, the missile crisis, and its resolution", order: 2, parentId: "hist-5" },
      { id: "hist-5-3", subjectId: "history-0470", code: "5.3", title: "Vietnam War", description: "US involvement, guerrilla tactics, Tet Offensive, anti-war movement, and US withdrawal", order: 3, parentId: "hist-5" },
    ],
  },
  {
    id: "hist-6", subjectId: "history-0470", code: "6",
    title: "How Secure Was the USSR's Control Over Eastern Europe?", description: "Soviet control and opposition behind the Iron Curtain from 1948 to 1989", order: 6,
    subObjectives: [
      { id: "hist-6-1", subjectId: "history-0470", code: "6.1", title: "Opposition and Hungarian Uprising", description: "Khrushchev's de-Stalinisation; Hungarian Uprising of 1956; Prague Spring of 1968", order: 1, parentId: "hist-6" },
      { id: "hist-6-2", subjectId: "history-0470", code: "6.2", title: "Collapse of Soviet Empire", description: "Solidarity in Poland; Gorbachev's reforms (glasnost and perestroika); fall of the Berlin Wall", order: 2, parentId: "hist-6" },
    ],
  },
  {
    id: "hist-7", subjectId: "history-0470", code: "7",
    title: "Depth Study: Germany, 1918-1945", description: "The Weimar Republic, the rise of Nazism, and life in Nazi Germany", order: 7,
    subObjectives: [
      { id: "hist-7-1", subjectId: "history-0470", code: "7.1", title: "The Weimar Republic", description: "The crises of 1923; hyperinflation; the Golden Age under Stresemann", order: 1, parentId: "hist-7" },
      { id: "hist-7-2", subjectId: "history-0470", code: "7.2", title: "Rise of Nazism and Dictatorship", description: "Impact of the Great Depression; Nazi electoral success; Reichstag Fire and Enabling Act", order: 2, parentId: "hist-7" },
      { id: "hist-7-3", subjectId: "history-0470", code: "7.3", title: "Nazi Germany and the Holocaust", description: "Persecution of minorities; youth and women in Nazi Germany; war economy and control", order: 3, parentId: "hist-7" },
    ],
  },
];

export const history0470Data: SyllabusData = {
  subject: historySubject,
  objectives: historyObjectives,
  notes: [],
};
