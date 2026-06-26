import type { NoteChapter } from "./types";

export const mathematicsNotes: NoteChapter[] = [
  {
    "subject": "Mathematics",
    "title": "Number",
    "pages": [
      {
        "section": "1.1 Integers, Fractions, Decimals, Percentages",
        "blocks": [
          {
            "kind": "video",
            "youtubeId": "5iNAPh6VBi0",
            "title": "Number \u2014 IGCSE Mathematics Lesson",
            "caption": "Comprehensive video tutorial covering the core concepts of Number"
          },
          {
            "kind": "intro",
            "text": "In this chapter, we will explore the world of numbers, including integers, fractions, decimals, and percentages. These concepts are fundamental to mathematics and are used in a wide range of applications, from science and engineering to finance and economics. Understanding the properties and relationships between these different types of numbers is essential for success in mathematics and other fields."
          },
          {
            "kind": "definition",
            "term": "Integer",
            "definition": "A whole number, either positive, negative, or zero, without a fractional part. Examples of integers include 1, 2, 3, and -4."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Fraction",
                "value": "A way of expressing a part of a whole as a ratio of two integers, such as 1/2 or 3/4."
              },
              {
                "label": "Decimal",
                "value": "A way of expressing a number using a point to separate the whole part from the fractional part, such as 0.5 or 3.14."
              },
              {
                "label": "Percentage",
                "value": "A way of expressing a proportion or fraction as a part of 100, such as 25% or 50%."
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "When working with fractions, it is essential to simplify them to their lowest terms to avoid confusion and ensure accuracy.",
            "color": "blue"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "Adding and subtracting fractions with the same denominator",
                "sub": [
                  "To add or subtract fractions with the same denominator, simply add or subtract the numerators and keep the denominator the same.",
                  "For example, 1/4 + 1/4 = 2/4, and 3/4 - 1/4 = 2/4."
                ]
              },
              {
                "text": "Adding and subtracting fractions with different denominators",
                "sub": [
                  "To add or subtract fractions with different denominators, first find the least common multiple (LCM) of the denominators.",
                  "Then, convert each fraction to have the LCM as the denominator, and add or subtract the numerators."
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Fraction",
              "Decimal",
              "Percentage"
            ],
            "rows": [
              [
                "1/2",
                "0.5",
                "50%"
              ],
              [
                "1/4",
                "0.25",
                "25%"
              ],
              [
                "3/4",
                "0.75",
                "75%"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Fraction_Wall.jpg/1024px-Fraction_Wall.jpg",
            "caption": "A visual representation of fractions on a number line."
          },
          {
            "kind": "tip",
            "text": "When converting between fractions, decimals, and percentages, it can be helpful to use a conversion chart or diagram to visualize the relationships between the different forms."
          }
        ]
      },
      {
        "section": "1.2 Indices and Standard Form",
        "blocks": [
          {
            "kind": "intro",
            "text": "In this section, we will explore the concepts of indices and standard form, which are used to express very large or very small numbers in a more compact and manageable form. Understanding these concepts is essential for working with scientific notation and performing calculations involving large or small numbers."
          },
          {
            "kind": "definition",
            "term": "Index",
            "definition": "A small number that is raised to a power to indicate the magnitude of a larger number. For example, in the expression 2^3, the index is 3."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Standard Form",
                "value": "A way of expressing a number in the form a x 10^n, where a is a number between 1 and 10, and n is an integer."
              },
              {
                "label": "Scientific Notation",
                "value": "A way of expressing a number in the form a x 10^n, where a is a number between 1 and 10, and n is an integer."
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "When working with indices, it is essential to follow the rules of exponentiation, such as multiplying powers with the same base by adding the indices, and dividing powers with the same base by subtracting the indices.",
            "color": "green"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "Multiplying powers with the same base",
                "sub": [
                  "To multiply powers with the same base, add the indices and keep the base the same.",
                  "For example, 2^3 x 2^4 = 2^(3+4) = 2^7."
                ]
              },
              {
                "text": "Dividing powers with the same base",
                "sub": [
                  "To divide powers with the same base, subtract the indices and keep the base the same.",
                  "For example, 2^7 \u00f7 2^3 = 2^(7-3) = 2^4."
                ]
              }
            ]
          },
          {
            "kind": "equation",
            "label": "Exponentiation Rule",
            "formula": "a^m x a^n = a^(m+n)",
            "note": "This rule applies when multiplying powers with the same base."
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Exponentiation.svg/1024px-Exponentiation.svg.png",
            "caption": "A visual representation of exponentiation."
          },
          {
            "kind": "warning",
            "text": "When working with standard form, be careful to ensure that the number is expressed in the correct form, with the coefficient between 1 and 10, and the exponent an integer."
          }
        ]
      }
    ]
  },
  {
    "subject": "Mathematics",
    "title": "Algebra and Graphs",
    "pages": [
      {
        "section": "2.1 Algebraic Manipulation",
        "blocks": [
          {
            "kind": "video",
            "youtubeId": "qEmS5C6P2pk",
            "title": "Algebra and Graphs \u2014 IGCSE Mathematics Lesson",
            "caption": "Comprehensive video tutorial covering the core concepts of Algebra and Graphs"
          },
          {
            "kind": "intro",
            "text": "Algebraic manipulation is a fundamental concept in mathematics that involves simplifying and solving equations using various techniques. It is essential to understand the rules of algebraic manipulation to solve complex equations and problems. In this section, we will explore the different methods of algebraic manipulation, including expanding and factoring expressions, simplifying equations, and solving linear equations."
          },
          {
            "kind": "definition",
            "term": "Algebraic Expression",
            "definition": "An algebraic expression is a mathematical expression that consists of variables, constants, and algebraic operations, such as addition, subtraction, multiplication, and division."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Term",
                "value": "A term is a single part of an algebraic expression, which can be a constant, a variable, or a product of constants and variables."
              },
              {
                "label": "Factor",
                "value": "A factor is a term that is multiplied by another term to produce an expression."
              },
              {
                "label": "Coefficient",
                "value": "A coefficient is a constant that is multiplied by a variable or an expression."
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The distributive property of multiplication over addition is a fundamental rule in algebraic manipulation, which states that a(b + c) = ab + ac.",
            "color": "blue"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "Expanding expressions using the distributive property",
                "sub": [
                  "Expanding expressions with multiple terms",
                  "Expanding expressions with parentheses"
                ]
              },
              {
                "text": "Factoring expressions using the greatest common factor",
                "sub": [
                  "Factoring expressions with multiple terms",
                  "Factoring expressions with variables"
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Method",
              "Description",
              "Example"
            ],
            "rows": [
              [
                "Expanding",
                "Using the distributive property to expand an expression",
                "a(b + c) = ab + ac"
              ],
              [
                "Factoring",
                "Using the greatest common factor to factor an expression",
                "ab + ac = a(b + c)"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Algebraic_expression.svg/1024px-Algebraic_expression.svg.png",
            "caption": "Algebraic Expression Diagram"
          },
          {
            "kind": "tip",
            "text": "When simplifying expressions, it is essential to combine like terms and use the distributive property to expand expressions."
          }
        ]
      },
      {
        "section": "2.2 Equations and Inequalities",
        "blocks": [
          {
            "kind": "intro",
            "text": "Equations and inequalities are fundamental concepts in mathematics that involve solving for unknown values. In this section, we will explore the different methods of solving equations and inequalities, including linear equations, quadratic equations, and systems of equations."
          },
          {
            "kind": "definition",
            "term": "Linear Equation",
            "definition": "A linear equation is an equation in which the highest power of the variable is 1, and the equation can be written in the form ax + b = c, where a, b, and c are constants."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Solution",
                "value": "A solution to an equation is a value of the variable that makes the equation true."
              },
              {
                "label": "Root",
                "value": "A root of an equation is a value of the variable that makes the equation equal to zero."
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The quadratic formula is a fundamental rule in solving quadratic equations, which states that x = (-b \u00b1 \u221a(b^2 - 4ac)) / 2a.",
            "color": "green"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "Solving linear equations using addition, subtraction, multiplication, and division",
                "sub": [
                  "Solving linear equations with fractions",
                  "Solving linear equations with decimals"
                ]
              },
              {
                "text": "Solving quadratic equations using factoring, the quadratic formula, and graphing",
                "sub": [
                  "Solving quadratic equations with multiple solutions",
                  "Solving quadratic equations with no real solutions"
                ]
              }
            ]
          },
          {
            "kind": "equation",
            "label": "Quadratic Formula",
            "formula": "x = (-b \u00b1 \u221a(b^2 - 4ac)) / 2a",
            "note": "The quadratic formula is used to solve quadratic equations of the form ax^2 + bx + c = 0."
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Quadratic_formula.svg/1024px-Quadratic_formula.svg.png",
            "caption": "Quadratic Formula Diagram"
          },
          {
            "kind": "warning",
            "text": "When solving equations, it is essential to check for extraneous solutions and to verify the solutions using the original equation."
          }
        ]
      },
      {
        "section": "2.3 Linear Programming",
        "blocks": [
          {
            "kind": "intro",
            "text": "Linear programming is a method of optimizing a linear objective function, subject to a set of linear constraints. It is a fundamental concept in mathematics and computer science, and has numerous applications in fields such as economics, finance, and engineering."
          },
          {
            "kind": "definition",
            "term": "Linear Objective Function",
            "definition": "A linear objective function is a function that is to be optimized, and is typically represented as a linear equation of the form ax + by = c, where a, b, and c are constants."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Constraint",
                "value": "A constraint is a limitation or restriction on the values of the variables in a linear programming problem."
              },
              {
                "label": "Feasible Region",
                "value": "The feasible region is the set of all possible solutions to a linear programming problem, subject to the given constraints."
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The graphical method is a fundamental technique in linear programming, which involves graphing the constraints and the objective function to find the optimal solution.",
            "color": "yellow"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "Formulating linear programming problems using mathematical models",
                "sub": [
                  "Defining the objective function and constraints",
                  "Identifying the decision variables and parameters"
                ]
              },
              {
                "text": "Solving linear programming problems using graphical and simplex methods",
                "sub": [
                  "Graphing the constraints and objective function",
                  "Applying the simplex algorithm to find the optimal solution"
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Method",
              "Description",
              "Example"
            ],
            "rows": [
              [
                "Graphical Method",
                "Graphing the constraints and objective function to find the optimal solution",
                "Maximize 3x + 4y, subject to x + y \u2264 10 and x \u2265 0, y \u2265 0"
              ],
              [
                "Simplex Method",
                "Applying the simplex algorithm to find the optimal solution",
                "Maximize 3x + 4y, subject to x + y \u2264 10 and x \u2265 0, y \u2265 0"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Linear_programming.svg/1024px-Linear_programming.svg.png",
            "caption": "Linear Programming Diagram"
          },
          {
            "kind": "tip",
            "text": "When solving linear programming problems, it is essential to define the objective function and constraints clearly, and to apply the graphical or simplex method to find the optimal solution."
          }
        ]
      }
    ]
  },
  {
    "subject": "Mathematics",
    "title": "Coordinate Geometry",
    "pages": [
      {
        "section": "3.1 Cartesian Coordinates",
        "blocks": [
          {
            "kind": "video",
            "youtubeId": "MsLJ3a9bTWo",
            "title": "Coordinate Geometry \u2014 IGCSE Mathematics Lesson",
            "caption": "Comprehensive video tutorial covering the core concepts of Coordinate Geometry"
          },
          {
            "kind": "intro",
            "text": "The Cartesian coordinate system is a fundamental concept in mathematics that allows us to represent points in a two-dimensional plane using ordered pairs of numbers. This system is named after the French philosopher and mathematician Ren\u00e9 Descartes, who first introduced it in the 17th century. The Cartesian coordinate system consists of two axes, the x-axis and the y-axis, which intersect at a point called the origin. The x-axis represents the horizontal direction, while the y-axis represents the vertical direction."
          },
          {
            "kind": "definition",
            "term": "Cartesian Coordinates",
            "definition": "A pair of numbers that represent the position of a point in a two-dimensional plane, with the first number representing the horizontal distance from the origin and the second number representing the vertical distance from the origin."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "x-coordinate",
                "value": "The horizontal distance from the origin to a point in the Cartesian coordinate system."
              },
              {
                "label": "y-coordinate",
                "value": "The vertical distance from the origin to a point in the Cartesian coordinate system."
              },
              {
                "label": "origin",
                "value": "The point where the x-axis and y-axis intersect in the Cartesian coordinate system."
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The Cartesian coordinate system is a powerful tool for representing and analyzing geometric shapes and relationships.",
            "color": "blue"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "The x-coordinate of a point can be positive, negative, or zero, depending on its position relative to the origin.",
                "sub": [
                  "If the x-coordinate is positive, the point lies to the right of the origin.",
                  "If the x-coordinate is negative, the point lies to the left of the origin.",
                  "If the x-coordinate is zero, the point lies on the y-axis."
                ]
              },
              {
                "text": "The y-coordinate of a point can also be positive, negative, or zero, depending on its position relative to the origin.",
                "sub": [
                  "If the y-coordinate is positive, the point lies above the origin.",
                  "If the y-coordinate is negative, the point lies below the origin.",
                  "If the y-coordinate is zero, the point lies on the x-axis."
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Quadrant",
              "x-coordinate",
              "y-coordinate"
            ],
            "rows": [
              [
                "I",
                "positive",
                "positive"
              ],
              [
                "II",
                "negative",
                "positive"
              ],
              [
                "III",
                "negative",
                "negative"
              ],
              [
                "IV",
                "positive",
                "negative"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cartesian_coordinate_system.svg/1024px-Cartesian_coordinate_system.svg.png",
            "caption": "The Cartesian coordinate system, showing the x-axis, y-axis, and the four quadrants."
          },
          {
            "kind": "tip",
            "text": "To plot a point in the Cartesian coordinate system, start at the origin and move horizontally by the x-coordinate, then move vertically by the y-coordinate."
          }
        ]
      },
      {
        "section": "3.2 Straight Line Graphs",
        "blocks": [
          {
            "kind": "intro",
            "text": "A straight line graph is a graphical representation of a linear equation, which is an equation in which the highest power of the variable is 1. Straight line graphs are used to model a wide range of real-world phenomena, such as the relationship between the distance traveled by an object and the time taken to travel that distance."
          },
          {
            "kind": "definition",
            "term": "Linear Equation",
            "definition": "An equation in which the highest power of the variable is 1, and the graph of which is a straight line."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "slope",
                "value": "A measure of the steepness of a straight line, which can be positive, negative, or zero."
              },
              {
                "label": "intercept",
                "value": "The point at which a straight line crosses the x-axis or y-axis."
              },
              {
                "label": "equation of a line",
                "value": "A mathematical expression that describes the relationship between the x-coordinate and y-coordinate of a point on a straight line."
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The slope-intercept form of a linear equation is y = mx + b, where m is the slope and b is the y-intercept.",
            "color": "green"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "The slope of a straight line can be positive, negative, or zero, depending on its orientation.",
                "sub": [
                  "If the slope is positive, the line slopes upward from left to right.",
                  "If the slope is negative, the line slopes downward from left to right.",
                  "If the slope is zero, the line is horizontal."
                ]
              },
              {
                "text": "The intercept of a straight line can be positive, negative, or zero, depending on its position relative to the origin.",
                "sub": [
                  "If the intercept is positive, the line crosses the x-axis or y-axis above the origin.",
                  "If the intercept is negative, the line crosses the x-axis or y-axis below the origin.",
                  "If the intercept is zero, the line passes through the origin."
                ]
              }
            ]
          },
          {
            "kind": "equation",
            "label": "Slope-Intercept Form",
            "formula": "y = mx + b",
            "note": "Where m is the slope and b is the y-intercept."
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Slope_intercept_form.svg/1024px-Slope_intercept_form.svg.png",
            "caption": "The slope-intercept form of a linear equation, showing the slope (m) and y-intercept (b)."
          },
          {
            "kind": "warning",
            "text": "When graphing a straight line, make sure to label the x-axis and y-axis correctly, and to use a consistent scale for both axes."
          }
        ]
      }
    ]
  },
  {
    "subject": "Mathematics",
    "title": "Geometry",
    "pages": [
      {
        "section": "4.1 Geometrical Terms and Shapes",
        "blocks": [
          {
            "kind": "video",
            "youtubeId": "Ek7Pk7-p3gI",
            "title": "Geometry \u2014 IGCSE Mathematics Lesson",
            "caption": "Comprehensive video tutorial covering the core concepts of Geometry"
          },
          {
            "kind": "intro",
            "text": "Geometry is a branch of mathematics that deals with the study of shapes, sizes, and positions of objects. It involves the use of various concepts, such as points, lines, angles, and planes, to describe and analyze the properties of different shapes. In this section, we will explore the basic geometrical terms and shapes that form the foundation of geometry."
          },
          {
            "kind": "definition",
            "term": "Point",
            "definition": "A point is a location in space, represented by a set of coordinates. It has no size or dimension, but it can be used to define the position of an object in space."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Line",
                "value": "A set of points that extend infinitely in two directions"
              },
              {
                "label": "Angle",
                "value": "The amount of rotation between two lines or planes that intersect at a point"
              },
              {
                "label": "Plane",
                "value": "A flat surface that extends infinitely in all directions"
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The concept of points, lines, angles, and planes is crucial in geometry, as it allows us to describe and analyze the properties of different shapes.",
            "color": "blue"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "Types of lines",
                "sub": [
                  "Intersecting lines: lines that cross each other at a point",
                  "Parallel lines: lines that never intersect, no matter how far they are extended",
                  "Perpendicular lines: lines that intersect at a right angle"
                ]
              },
              {
                "text": "Types of angles",
                "sub": [
                  "Acute angle: an angle that is less than 90 degrees",
                  "Right angle: an angle that is exactly 90 degrees",
                  "Obtuse angle: an angle that is greater than 90 degrees"
                ]
              }
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Geometry_shapes.svg/1024px-Geometry_shapes.svg.png",
            "caption": "Basic geometrical shapes, including points, lines, angles, and planes."
          },
          {
            "kind": "table",
            "headers": [
              "Shape",
              "Number of sides",
              "Number of angles"
            ],
            "rows": [
              [
                "Triangle",
                "3",
                "3"
              ],
              [
                "Quadrilateral",
                "4",
                "4"
              ],
              [
                "Pentagon",
                "5",
                "5"
              ],
              [
                "Hexagon",
                "6",
                "6"
              ]
            ]
          },
          {
            "kind": "tip",
            "text": "When working with geometrical shapes, it's essential to remember the properties of each shape, such as the number of sides and angles, to solve problems and prove theorems."
          }
        ]
      },
      {
        "section": "4.2 Angle Properties",
        "blocks": [
          {
            "kind": "intro",
            "text": "Angles are a fundamental concept in geometry, and understanding their properties is crucial for solving problems and proving theorems. In this section, we will explore the different types of angles and their properties."
          },
          {
            "kind": "definition",
            "term": "Angle sum property",
            "definition": "The sum of the interior angles of a triangle is always 180 degrees."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Complementary angles",
                "value": "Angles that add up to 90 degrees"
              },
              {
                "label": "Supplementary angles",
                "value": "Angles that add up to 180 degrees"
              },
              {
                "label": "Corresponding angles",
                "value": "Angles that are in the same relative position in two different intersections"
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The angle sum property is a fundamental concept in geometry, and it can be used to solve problems and prove theorems.",
            "color": "green"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "Properties of complementary angles",
                "sub": [
                  "Complementary angles are two angles that add up to 90 degrees",
                  "Complementary angles are used to find the measure of an angle"
                ]
              },
              {
                "text": "Properties of supplementary angles",
                "sub": [
                  "Supplementary angles are two angles that add up to 180 degrees",
                  "Supplementary angles are used to find the measure of an angle"
                ]
              }
            ]
          },
          {
            "kind": "equation",
            "label": "Angle sum property",
            "formula": "\u2220A + \u2220B + \u2220C = 180\u00b0",
            "note": "This equation represents the sum of the interior angles of a triangle."
          },
          {
            "kind": "warning",
            "text": "When working with angles, it's essential to remember that the measure of an angle is always expressed in degrees, and it's crucial to use the correct units when solving problems."
          },
          {
            "kind": "comparison",
            "left": {
              "label": "Acute angle",
              "items": [
                "Less than 90 degrees",
                "Example: 30\u00b0"
              ]
            },
            "right": {
              "label": "Obtuse angle",
              "items": [
                "Greater than 90 degrees",
                "Example: 120\u00b0"
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "subject": "Mathematics",
    "title": "Mensuration",
    "pages": [
      {
        "section": "5.1 2D Shapes",
        "blocks": [
          {
            "kind": "video",
            "youtubeId": "k1fGZ6KxFos",
            "title": "Mensuration \u2014 IGCSE Mathematics Lesson",
            "caption": "Comprehensive video tutorial covering the core concepts of Mensuration"
          },
          {
            "kind": "intro",
            "text": "Mensuration is the branch of mathematics that deals with the measurement of geometric shapes. In this chapter, we will explore the concepts of mensuration, starting with two-dimensional shapes. 2D shapes are flat shapes that have length and width, but no depth. Examples of 2D shapes include squares, rectangles, triangles, and circles."
          },
          {
            "kind": "definition",
            "term": "Perimeter",
            "definition": "The perimeter of a 2D shape is the total length of its boundary. It is calculated by adding up the lengths of all the sides of the shape."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Area",
                "value": "The amount of space inside a 2D shape"
              },
              {
                "label": "Perimeter",
                "value": "The total length of the boundary of a 2D shape"
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The formula for the perimeter of a rectangle is P = 2(l + w), where l is the length and w is the width.",
            "color": "blue"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "The area of a rectangle can be calculated using the formula A = l * w, where l is the length and w is the width.",
                "sub": [
                  "This formula can be used to find the area of any rectangle, regardless of its size or shape.",
                  "It is an important concept in mensuration, as it allows us to calculate the amount of space inside a 2D shape."
                ]
              },
              {
                "text": "The perimeter of a triangle can be calculated using the formula P = a + b + c, where a, b, and c are the lengths of the sides.",
                "sub": [
                  "This formula can be used to find the perimeter of any triangle, regardless of its size or shape.",
                  "It is an important concept in mensuration, as it allows us to calculate the total length of the boundary of a 2D shape."
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Shape",
              "Area Formula",
              "Perimeter Formula"
            ],
            "rows": [
              [
                "Rectangle",
                "A = l * w",
                "P = 2(l + w)"
              ],
              [
                "Triangle",
                "A = (b * h) / 2",
                "P = a + b + c"
              ],
              [
                "Circle",
                "A = \u03c0 * r^2",
                "P = 2 * \u03c0 * r"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Rectangle.svg/1024px-Rectangle.svg.png",
            "caption": "A diagram of a rectangle, showing its length, width, area, and perimeter."
          },
          {
            "kind": "tip",
            "text": "When calculating the area and perimeter of a 2D shape, make sure to use the correct formulas and units. It's also important to check your work and ensure that your answers are reasonable."
          }
        ]
      },
      {
        "section": "5.2 3D Shapes",
        "blocks": [
          {
            "kind": "intro",
            "text": "In addition to 2D shapes, mensuration also deals with three-dimensional shapes. 3D shapes have length, width, and depth, and are used to model real-world objects. Examples of 3D shapes include cubes, spheres, and pyramids."
          },
          {
            "kind": "definition",
            "term": "Volume",
            "definition": "The volume of a 3D shape is the amount of space inside the shape. It is calculated by multiplying the length, width, and height of the shape."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Surface Area",
                "value": "The total area of the surface of a 3D shape"
              },
              {
                "label": "Volume",
                "value": "The amount of space inside a 3D shape"
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The formula for the volume of a cube is V = s^3, where s is the length of one side.",
            "color": "green"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "The surface area of a sphere can be calculated using the formula A = 4 * \u03c0 * r^2, where r is the radius.",
                "sub": [
                  "This formula can be used to find the surface area of any sphere, regardless of its size or shape.",
                  "It is an important concept in mensuration, as it allows us to calculate the total area of the surface of a 3D shape."
                ]
              },
              {
                "text": "The volume of a pyramid can be calculated using the formula V = (1/3) * B * h, where B is the area of the base and h is the height.",
                "sub": [
                  "This formula can be used to find the volume of any pyramid, regardless of its size or shape.",
                  "It is an important concept in mensuration, as it allows us to calculate the amount of space inside a 3D shape."
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Shape",
              "Surface Area Formula",
              "Volume Formula"
            ],
            "rows": [
              [
                "Cube",
                "A = 6 * s^2",
                "V = s^3"
              ],
              [
                "Sphere",
                "A = 4 * \u03c0 * r^2",
                "V = (4/3) * \u03c0 * r^3"
              ],
              [
                "Pyramid",
                "A = B + (1/2) * P * s",
                "V = (1/3) * B * h"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Cube.svg/1024px-Cube.svg.png",
            "caption": "A diagram of a cube, showing its length, width, height, surface area, and volume."
          },
          {
            "kind": "warning",
            "text": "When working with 3D shapes, it's easy to get confused between surface area and volume. Make sure to use the correct formulas and units, and double-check your work to ensure that your answers are reasonable."
          }
        ]
      }
    ]
  },
  {
    "subject": "Mathematics",
    "title": "Trigonometry",
    "pages": [
      {
        "section": "6.1 Trigonometric Ratios",
        "blocks": [
          {
            "kind": "video",
            "youtubeId": "3m91z_VRNPY",
            "title": "Trigonometry \u2014 IGCSE Mathematics Lesson",
            "caption": "Comprehensive video tutorial covering the core concepts of Trigonometry"
          },
          {
            "kind": "intro",
            "text": "Trigonometry is a branch of mathematics that deals with the relationships between the sides and angles of triangles. In this chapter, we will explore the concept of trigonometric ratios, which are used to describe these relationships. Trigonometric ratios are essential in various fields, including physics, engineering, and navigation."
          },
          {
            "kind": "definition",
            "term": "Trigonometric Ratio",
            "definition": "A trigonometric ratio is a ratio of the lengths of two sides of a right-angled triangle. The three basic trigonometric ratios are sine, cosine, and tangent."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Sine",
                "value": "The ratio of the length of the side opposite the angle to the length of the hypotenuse"
              },
              {
                "label": "Cosine",
                "value": "The ratio of the length of the side adjacent to the angle to the length of the hypotenuse"
              },
              {
                "label": "Tangent",
                "value": "The ratio of the length of the side opposite the angle to the length of the side adjacent to the angle"
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "SOH-CAH-TOA",
            "color": "blue"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "The sine of an angle is equal to the ratio of the length of the side opposite the angle to the length of the hypotenuse",
                "sub": [
                  "This can be expressed mathematically as sin(\u03b8) = opposite side / hypotenuse",
                  "The sine function is periodic with a period of 2\u03c0"
                ]
              },
              {
                "text": "The cosine of an angle is equal to the ratio of the length of the side adjacent to the angle to the length of the hypotenuse",
                "sub": [
                  "This can be expressed mathematically as cos(\u03b8) = adjacent side / hypotenuse",
                  "The cosine function is also periodic with a period of 2\u03c0"
                ]
              },
              {
                "text": "The tangent of an angle is equal to the ratio of the length of the side opposite the angle to the length of the side adjacent to the angle",
                "sub": [
                  "This can be expressed mathematically as tan(\u03b8) = opposite side / adjacent side",
                  "The tangent function is periodic with a period of \u03c0"
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Trigonometric Ratio",
              "Definition",
              "Mathematical Expression"
            ],
            "rows": [
              [
                "Sine",
                "The ratio of the length of the side opposite the angle to the length of the hypotenuse",
                "sin(\u03b8) = opposite side / hypotenuse"
              ],
              [
                "Cosine",
                "The ratio of the length of the side adjacent to the angle to the length of the hypotenuse",
                "cos(\u03b8) = adjacent side / hypotenuse"
              ],
              [
                "Tangent",
                "The ratio of the length of the side opposite the angle to the length of the side adjacent to the angle",
                "tan(\u03b8) = opposite side / adjacent side"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Trigonometric_functions.svg/1024px-Trigonometric_functions.svg.png",
            "caption": "A diagram showing the relationships between the sides and angles of a right-angled triangle"
          },
          {
            "kind": "tip",
            "text": "To remember the trigonometric ratios, use the mnemonic SOH-CAH-TOA, which stands for Sine = Opposite over Hypotenuse, Cosine = Adjacent over Hypotenuse, and Tangent = Opposite over Adjacent"
          }
        ]
      },
      {
        "section": "6.2 Applications",
        "blocks": [
          {
            "kind": "intro",
            "text": "Trigonometric ratios have numerous applications in various fields, including physics, engineering, and navigation. In this section, we will explore some of the key applications of trigonometric ratios."
          },
          {
            "kind": "definition",
            "term": "Right-Angled Triangle",
            "definition": "A triangle with one right angle (90 degrees) is called a right-angled triangle. Trigonometric ratios are used to describe the relationships between the sides and angles of right-angled triangles."
          },
          {
            "kind": "keyterms",
            "terms": [
              {
                "label": "Surveying",
                "value": "The use of trigonometric ratios to determine the distance between two points on the Earth's surface"
              },
              {
                "label": "Navigation",
                "value": "The use of trigonometric ratios to determine the position and direction of a ship or aircraft"
              },
              {
                "label": "Physics",
                "value": "The use of trigonometric ratios to describe the motion of objects in terms of their position, velocity, and acceleration"
              }
            ]
          },
          {
            "kind": "highlight",
            "text": "The Law of Sines",
            "color": "green"
          },
          {
            "kind": "bullets",
            "items": [
              {
                "text": "The Law of Sines states that for any triangle with angles A, B, and C, and opposite sides a, b, and c, the following equation holds: a / sin(A) = b / sin(B) = c / sin(C)",
                "sub": [
                  "This law can be used to find the length of a side of a triangle, given the lengths of the other two sides and the measure of one of the angles",
                  "The Law of Sines is a fundamental principle in trigonometry and has numerous applications in physics, engineering, and navigation"
                ]
              },
              {
                "text": "The Law of Cosines states that for any triangle with angles A, B, and C, and opposite sides a, b, and c, the following equation holds: c^2 = a^2 + b^2 - 2ab * cos(C)",
                "sub": [
                  "This law can be used to find the length of a side of a triangle, given the lengths of the other two sides and the measure of one of the angles",
                  "The Law of Cosines is a fundamental principle in trigonometry and has numerous applications in physics, engineering, and navigation"
                ]
              }
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Application",
              "Description",
              "Trigonometric Ratio Used"
            ],
            "rows": [
              [
                "Surveying",
                "Determining the distance between two points on the Earth's surface",
                "Sine, Cosine, and Tangent"
              ],
              [
                "Navigation",
                "Determining the position and direction of a ship or aircraft",
                "Sine, Cosine, and Tangent"
              ],
              [
                "Physics",
                "Describing the motion of objects in terms of their position, velocity, and acceleration",
                "Sine, Cosine, and Tangent"
              ]
            ]
          },
          {
            "kind": "image",
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Law_of_sines.svg/1024px-Law_of_sines.svg.png",
            "caption": "A diagram showing the Law of Sines"
          },
          {
            "kind": "warning",
            "text": "When using trigonometric ratios to solve problems, make sure to check the units of the given values and the units of the answer. Trigonometric ratios are often used to describe relationships between lengths, so it is essential to ensure that the units are consistent."
          }
        ]
      }
    ]
  }
];
