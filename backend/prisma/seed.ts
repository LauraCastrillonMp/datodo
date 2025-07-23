import {
  PrismaClient,
  UserRole,
  ContentFormat,
  DataStructureContentType,
  DataStructureDifficulty,
  QuizDifficulty,
  QuizQuestionType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
  console.log('🌱  Seeding the database...');

  // dummy passwords
  const passwordAdmin = await bcrypt.hash('admin123', roundsOfHashing);
  const passwordTeacher = await bcrypt.hash('teacher123', roundsOfHashing);
  const passwordStudent = await bcrypt.hash('student123', roundsOfHashing);

  // create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@datodo.com' },
    update: { password: passwordAdmin },
    create: {
      email: 'admin@datodo.com',
      password: passwordAdmin,
      role: UserRole.admin,
      name: 'Admin',
      username: 'adminuser',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@datodo.com' },
    update: { password: passwordTeacher },
    create: {
      email: 'teacher@datodo.com',
      password: passwordTeacher,
      role: UserRole.teacher,
      name: 'Teacher',
      username: 'teacheruser',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@datodo.com' },
    update: { password: passwordStudent },
    create: {
      email: 'student@datodo.com',
      password: passwordStudent,
      role: UserRole.student,
      name: 'Student',
      username: 'studentuser',
    },
  });

  // create data structures and quizzes
  const queue = await prisma.dataStructure.create({
    data: {
      title: 'Colas',
      slug: 'colas',
      description: 'Estructura FIFO: Primero en entrar, primero en salir.',
      difficulty: DataStructureDifficulty.principiante,
      creator: { connect: { id: admin.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            format: ContentFormat.text,
            name: 'Definición de Cola',
            description:
              'Una cola (queue) es una estructura de datos lineal que sigue el principio FIFO...',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Enqueue',
            format: ContentFormat.text,
            description: 'Agrega un elemento al final de la cola. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Dequeue',
            format: ContentFormat.text,
            description: 'Elimina y retorna el elemento del frente de la cola. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Peek',
            format: ContentFormat.text,
            description: 'Retorna el elemento del frente sin eliminarlo. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'IsEmpty',
            format: ContentFormat.text,
            description: 'Verifica si la cola está vacía. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description: 'Retorna el número de elementos en la cola. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Sistemas de impresión',
            description: 'Las colas se usan para gestionar trabajos de impresión en orden de llegada.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Búsqueda en anchura (BFS)',
            description: 'El algoritmo BFS utiliza una cola para recorrer grafos o árboles por niveles.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Simulaciones de colas',
            description: 'Modelado de líneas de espera en bancos, supermercados, etc.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Gestión de tareas',
            description: 'Procesamiento de tareas en orden de llegada.',
          },
          {
            contentType: DataStructureContentType.resource,
            format: ContentFormat.link,
            name: 'Visualización USFCA',
            description:
              'https://www.cs.usfca.edu/~galles/visualization/QueueArray.html',
          },
          {
            contentType: DataStructureContentType.resource,
            format: ContentFormat.link,
            name: 'VisuAlgo Queue',
            description: 'https://visualgo.net/en/list',
          },
          {
            contentType: DataStructureContentType.resource,
            format: ContentFormat.video,
            name: 'Video explicativo',
            description: 'https://youtu.be/D6gu-_tmEpQ?si=TJTe4rOtM__qtViL',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Linear Structure',
            format: ContentFormat.text,
            description: 'Una cola es una estructura de datos lineal donde los elementos se procesan en orden FIFO (First-In, First-Out).',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Dynamic Size',
            format: ContentFormat.text,
            description: 'El tamaño de la cola puede crecer o decrecer dinámicamente según las operaciones de inserción y eliminación.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description: 'Las operaciones principales (enqueue, dequeue, peek) tienen una complejidad de tiempo O(1).',
            complexity: 'O(1)',
          },
        ],
      },
      quizzes: {
        create: {
          title: 'Cuestionario de Colas',
          description: 'Evalúa tu comprensión sobre colas',
          difficulty: QuizDifficulty.principiante,
          creator: { connect: { id: teacher.id } },
          questions: {
            create: [
              {
                questionText:
                  '¿Qué significa que una cola siga el principio FIFO?',
                questionType: QuizQuestionType.multiple_choice,
                order: 1,
                options: {
                  create: [
                    {
                      optionText: 'El primero en entrar es el primero en salir',
                      isCorrect: true,
                      order: 1,
                    },
                    {
                      optionText: 'El último en entrar es el primero en salir',
                      isCorrect: false,
                      order: 2,
                    },
                    {
                      optionText: 'Todos los elementos entran y salen a la vez',
                      isCorrect: false,
                      order: 3,
                    },
                    {
                      optionText: 'El elemento más grande sale primero',
                      isCorrect: false,
                      order: 4,
                    },
                  ],
                },
              },
              {
                questionText:
                  '¿Cuál es la operación que agrega un elemento a la cola?',
                questionType: QuizQuestionType.multiple_choice,
                order: 2,
                options: {
                  create: [
                    { optionText: 'pop()', isCorrect: false, order: 1 },
                    { optionText: 'enqueue()', isCorrect: true, order: 2 },
                    { optionText: 'insert()', isCorrect: false, order: 3 },
                    { optionText: 'push()', isCorrect: false, order: 4 },
                  ],
                },
              },
              {
                questionText:
                  '¿Cuál de las siguientes colas permite inserción y eliminación en ambos extremos?',
                questionType: QuizQuestionType.multiple_choice,
                order: 3,
                options: {
                  create: [
                    { optionText: 'Cola circular', isCorrect: false, order: 1 },
                    {
                      optionText: 'Cola de prioridad',
                      isCorrect: false,
                      order: 2,
                    },
                    { optionText: 'Deque', isCorrect: true, order: 3 },
                    { optionText: 'Cola simple', isCorrect: false, order: 4 },
                  ],
                },
              },
              {
                questionText:
                  '¿Qué representa mejor el funcionamiento de una cola simple?',
                questionType: QuizQuestionType.multiple_choice,
                order: 4,
                options: {
                  create: [
                    {
                      optionText: 'Cola en una tienda',
                      isCorrect: true,
                      order: 1,
                    },
                    {
                      optionText: 'Torre de platos',
                      isCorrect: false,
                      order: 2,
                    },
                    {
                      optionText: 'Historial del navegador',
                      isCorrect: false,
                      order: 3,
                    },
                    { optionText: 'Árbol binario', isCorrect: false, order: 4 },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  });

  // create another data structure - stack
  const stack = await prisma.dataStructure.create({
    data: {
      title: 'Pilas',
      slug: 'pilas',
      description: 'Estructura LIFO: Último en entrar, primero en salir.',
      difficulty: DataStructureDifficulty.principiante,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Pila',
            format: ContentFormat.text,
            description:
              'Una pila es una estructura de datos que sigue el principio LIFO...',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Push',
            format: ContentFormat.text,
            description: 'Agrega un elemento en la parte superior de la pila. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Pop',
            format: ContentFormat.text,
            description: 'Elimina y retorna el elemento de la parte superior de la pila. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Peek',
            format: ContentFormat.text,
            description: 'Retorna el elemento de la parte superior sin eliminarlo. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'IsEmpty',
            format: ContentFormat.text,
            description: 'Verifica si la pila está vacía. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description: 'Retorna el número de elementos en la pila. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Deshacer/rehacer en editores',
            description: 'Las pilas permiten implementar funcionalidades de deshacer y rehacer en aplicaciones.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Evaluación de expresiones',
            description: 'Las pilas se usan para evaluar expresiones matemáticas y convertir notaciones.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Navegadores web (historial)',
            description: 'El historial de navegación se gestiona como una pila.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Llamadas a funciones (call stack)',
            description: 'El call stack de un programa es una pila de llamadas a funciones.',
          },
          {
            contentType: DataStructureContentType.resource,
            name: 'VisuAlgo Stack',
            format: ContentFormat.link,
            description: 'https://visualgo.net/en/list',
          },
          {
            contentType: DataStructureContentType.resource,
            name: 'Video explicativo',
            format: ContentFormat.video,
            description: 'https://youtu.be/lhhyE7NVcbg?si=pB0rQSBIIHaEiruv',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Linear Structure',
            format: ContentFormat.text,
            description: 'Una pila es una estructura de datos lineal que sigue el principio LIFO (Last-In, First-Out).',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Dynamic Size',
            format: ContentFormat.text,
            description: 'El tamaño de la pila puede crecer o decrecer dinámicamente según las operaciones de inserción y eliminación.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description: 'Las operaciones principales (push, pop, peek) tienen una complejidad de tiempo O(1).',
            complexity: 'O(1)',
          },
        ],
      },
      quizzes: {
        create: {
          title: 'Cuestionario de Pilas',
          description: 'Evalúa tu comprensión sobre pilas',
          difficulty: QuizDifficulty.principiante,
          creator: { connect: { id: teacher.id } },
          questions: {
            create: [
              {
                questionText:
                  '¿Qué significa que una pila siga el principio LIFO?',
                questionType: QuizQuestionType.multiple_choice,
                order: 1,
                options: {
                  create: [
                    {
                      optionText: 'Último en entrar es el primero en salir',
                      isCorrect: true,
                      order: 1,
                    },
                    {
                      optionText: 'Primero en entrar es el primero en salir',
                      isCorrect: false,
                      order: 2,
                    },
                    {
                      optionText: 'Todos los elementos salen al mismo tiempo',
                      isCorrect: false,
                      order: 3,
                    },
                    {
                      optionText: 'Se insertan en cualquier posición',
                      isCorrect: false,
                      order: 4,
                    },
                  ],
                },
              },
              {
                questionText:
                  '¿Cuál es la operación que elimina el último elemento agregado en una pila?',
                questionType: QuizQuestionType.multiple_choice,
                order: 2,
                options: {
                  create: [
                    { optionText: 'enqueue()', isCorrect: false, order: 1 },
                    { optionText: 'pop()', isCorrect: true, order: 2 },
                    { optionText: 'peek()', isCorrect: false, order: 3 },
                    { optionText: 'shift()', isCorrect: false, order: 4 },
                  ],
                },
              },
              {
                questionText:
                  '¿Qué estructura del mundo real representa mejor una pila?',
                questionType: QuizQuestionType.multiple_choice,
                order: 3,
                options: {
                  create: [
                    {
                      optionText: 'Cola en una tienda',
                      isCorrect: false,
                      order: 1,
                    },
                    { optionText: 'Pila de platos', isCorrect: true, order: 2 },
                    {
                      optionText: 'Cinta transportadora',
                      isCorrect: false,
                      order: 3,
                    },
                    {
                      optionText: 'Calendario de eventos',
                      isCorrect: false,
                      order: 4,
                    },
                  ],
                },
              },
              {
                questionText:
                  '¿Qué operación te permite ver el último elemento agregado sin eliminarlo?',
                questionType: QuizQuestionType.multiple_choice,
                order: 4,
                options: {
                  create: [
                    { optionText: 'peek()', isCorrect: true, order: 1 },
                    { optionText: 'pop()', isCorrect: false, order: 2 },
                    { optionText: 'push()', isCorrect: false, order: 3 },
                    { optionText: 'top()', isCorrect: false, order: 4 },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  });

  // Create sample quizzes for data structures
  const stackQuiz = await prisma.quiz.create({
    data: {
      title: "Stack Fundamentals Quiz",
      description: "Test your knowledge about stack data structure",
      difficulty: "principiante",
      dataStructureId: stack.id,
      createdBy: admin.id,
      questions: {
        create: [
          {
            questionText: "What principle does a stack follow?",
            questionType: "multiple_choice",
            order: 1,
            options: {
              create: [
                { optionText: "LIFO (Last In, First Out)", isCorrect: true, order: 1 },
                { optionText: "FIFO (First In, First Out)", isCorrect: false, order: 2 },
                { optionText: "Random Access", isCorrect: false, order: 3 },
                { optionText: "Sequential Access", isCorrect: false, order: 4 },
              ],
            },
          },
          {
            questionText: "What is the time complexity of push operation in a stack?",
            questionType: "multiple_choice",
            order: 2,
            options: {
              create: [
                { optionText: "O(1)", isCorrect: true, order: 1 },
                { optionText: "O(log n)", isCorrect: false, order: 2 },
                { optionText: "O(n)", isCorrect: false, order: 3 },
                { optionText: "O(n²)", isCorrect: false, order: 4 },
              ],
            },
          },
          {
            questionText: "Which operation removes the top element from a stack?",
            questionType: "multiple_choice",
            order: 3,
            options: {
              create: [
                { optionText: "Push", isCorrect: false, order: 1 },
                { optionText: "Pop", isCorrect: true, order: 2 },
                { optionText: "Peek", isCorrect: false, order: 3 },
                { optionText: "Insert", isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  const queueQuiz = await prisma.quiz.create({
    data: {
      title: "Queue Fundamentals Quiz",
      description: "Test your knowledge about queue data structure",
      difficulty: "principiante",
      dataStructureId: queue.id,
      createdBy: admin.id,
      questions: {
        create: [
          {
            questionText: "What principle does a queue follow?",
            questionType: "multiple_choice",
            order: 1,
            options: {
              create: [
                { optionText: "LIFO (Last In, First Out)", isCorrect: false, order: 1 },
                { optionText: "FIFO (First In, First Out)", isCorrect: true, order: 2 },
                { optionText: "Random Access", isCorrect: false, order: 3 },
                { optionText: "Sequential Access", isCorrect: false, order: 4 },
              ],
            },
          },
          {
            questionText: "What is the time complexity of enqueue operation in a queue?",
            questionType: "multiple_choice",
            order: 2,
            options: {
              create: [
                { optionText: "O(1)", isCorrect: true, order: 1 },
                { optionText: "O(log n)", isCorrect: false, order: 2 },
                { optionText: "O(n)", isCorrect: false, order: 3 },
                { optionText: "O(n²)", isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  // Create linked list data structure
  const linkedList = await prisma.dataStructure.create({
    data: {
      title: 'Lista Enlazada Simple',
      slug: 'lista-enlazada-simple',
      description: 'Estructura de datos lineal donde cada elemento apunta al siguiente.',
      difficulty: DataStructureDifficulty.principiante,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Lista Enlazada Simple',
            format: ContentFormat.text,
            description: 'Una lista enlazada simple es una estructura de datos lineal donde cada elemento (nodo) contiene datos y una referencia al siguiente nodo. El último nodo apunta a NULL.',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description: 'Inserta un nuevo nodo en la lista. Complejidad: O(1) para inserción al inicio, O(n) para inserción al final',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description: 'Elimina un nodo de la lista. Complejidad: O(1) para eliminación al inicio, O(n) para eliminación al final',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Search',
            format: ContentFormat.text,
            description: 'Busca un elemento en la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Traverse',
            format: ContentFormat.text,
            description: 'Recorre todos los elementos de la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description: 'Retorna el número de nodos en la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Implementación de otras estructuras',
            description: 'Listas enlazadas se usan para implementar pilas, colas y tablas hash.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Navegadores (páginas adelante/atrás)',
            description: 'Permiten navegar hacia adelante y atrás en el historial.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Gestión de memoria',
            description: 'Listas libres y asignación dinámica de memoria.',
          },
          {
            contentType: DataStructureContentType.resource,
            name: 'VisuAlgo Linked List',
            format: ContentFormat.link,
            description: 'https://visualgo.net/en/list',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Dynamic Structure',
            format: ContentFormat.text,
            description: 'Una lista enlazada simple es una estructura de datos dinámica donde cada elemento apunta al siguiente.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Efficient Insert/Delete',
            format: ContentFormat.text,
            description: 'Permite inserciones y eliminaciones eficientes en cualquier posición, especialmente al inicio.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description: 'Acceso: O(n), Inserción/Eliminación: O(1) (al inicio), Búsqueda: O(n).',
            complexity: 'O(1) / O(n)',
          },
        ],
      },
    },
  });

  // Create double linked list data structure
  const doubleLinkedList = await prisma.dataStructure.create({
    data: {
      title: 'Lista Enlazada Doble',
      slug: 'lista-enlazada-doble',
      description: 'Estructura de datos lineal donde cada elemento apunta al anterior y al siguiente.',
      difficulty: DataStructureDifficulty.intermedio,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Lista Enlazada Doble',
            format: ContentFormat.text,
            description: 'Una lista enlazada doble es una estructura de datos lineal donde cada nodo contiene datos, una referencia al nodo anterior y una referencia al nodo siguiente. Permite navegación en ambas direcciones.',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description: 'Inserta un nuevo nodo en la lista. Complejidad: O(1) para inserción al inicio/final, O(n) para inserción en posición específica',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description: 'Elimina un nodo de la lista. Complejidad: O(1) si se conoce la posición, O(n) para búsqueda',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Search',
            format: ContentFormat.text,
            description: 'Busca un elemento en la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Traverse Forward',
            format: ContentFormat.text,
            description: 'Recorre todos los elementos de la lista hacia adelante. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Traverse Backward',
            format: ContentFormat.text,
            description: 'Recorre todos los elementos de la lista hacia atrás. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description: 'Retorna el número de nodos en la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Navegadores web',
            description: 'Historial de navegación con botones adelante/atrás.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Editores de texto',
            description: 'Deshacer y rehacer operaciones.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Reproductores multimedia',
            description: 'Listas de reproducción con navegación bidireccional.',
          },
          {
            contentType: DataStructureContentType.resource,
            name: 'VisuAlgo Doubly Linked List',
            format: ContentFormat.link,
            description: 'https://visualgo.net/en/list?slide=1',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Bidirectional Navigation',
            format: ContentFormat.text,
            description: 'Permite navegar hacia adelante y hacia atrás en la lista de manera eficiente.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Efficient Deletion',
            format: ContentFormat.text,
            description: 'Eliminación más eficiente ya que no necesitamos mantener un puntero al nodo anterior.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Memory Overhead',
            format: ContentFormat.text,
            description: 'Requiere más memoria por nodo debido a los punteros adicionales.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description: 'Acceso: O(n), Inserción/Eliminación: O(1) (si se conoce la posición), Búsqueda: O(n).',
            complexity: 'O(1) / O(n)',
          },
        ],
      },
    },
  });

  // Create circular linked list data structure
  const circularLinkedList = await prisma.dataStructure.create({
    data: {
      title: 'Lista Enlazada Circular',
      slug: 'lista-enlazada-circular',
      description: 'Estructura de datos donde el último elemento apunta al primero, formando un círculo.',
      difficulty: DataStructureDifficulty.intermedio,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Lista Enlazada Circular',
            format: ContentFormat.text,
            description: 'Una lista enlazada circular es una estructura de datos donde el último nodo apunta al primer nodo, formando un círculo. No hay un nodo final que apunte a NULL.',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description: 'Inserta un nuevo nodo en la lista. Complejidad: O(1) para inserción al inicio, O(n) para inserción al final',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description: 'Elimina un nodo de la lista. Complejidad: O(1) para eliminación al inicio, O(n) para eliminación al final',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Search',
            format: ContentFormat.text,
            description: 'Busca un elemento en la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Traverse',
            format: ContentFormat.text,
            description: 'Recorre todos los elementos de la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description: 'Retorna el número de nodos en la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'IsCircular',
            format: ContentFormat.text,
            description: 'Verifica si la lista es circular. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Sistemas operativos',
            description: 'Planificación de procesos con round-robin.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Juegos',
            description: 'Turnos de jugadores en juegos de mesa.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Reproductores de música',
            description: 'Reproducción en bucle de listas de canciones.',
          },
          {
            contentType: DataStructureContentType.resource,
            name: 'VisuAlgo Circular Linked List',
            format: ContentFormat.link,
            description: 'https://visualgo.net/en/list?slide=2',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'No End Point',
            format: ContentFormat.text,
            description: 'No hay un nodo final que apunte a NULL, todos los nodos están conectados en un círculo.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Efficient Traversal',
            format: ContentFormat.text,
            description: 'Permite recorrer la lista infinitamente sin necesidad de reiniciar.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Memory Efficiency',
            format: ContentFormat.text,
            description: 'No se necesita un puntero especial para el final de la lista.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description: 'Acceso: O(n), Inserción/Eliminación: O(1) (al inicio), Búsqueda: O(n).',
            complexity: 'O(1) / O(n)',
          },
        ],
      },
    },
  });

  // Create binary search tree data structure
  const bst = await prisma.dataStructure.create({
    data: {
      title: 'Árbol Binario de Búsqueda',
      slug: 'arbol-binario',
      description: 'Estructura de datos jerárquica donde cada nodo tiene como máximo dos hijos.',
      difficulty: DataStructureDifficulty.intermedio,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Árbol Binario',
            format: ContentFormat.text,
            description: 'Un árbol binario es una estructura de datos jerárquica donde cada nodo tiene como máximo dos hijos...',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description: 'Inserta un nuevo nodo manteniendo la propiedad del árbol. Complejidad: O(log n) en promedio',
            complexity: 'O(log n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Search',
            format: ContentFormat.text,
            description: 'Busca un elemento en el árbol. Complejidad: O(log n) en promedio',
            complexity: 'O(log n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description: 'Elimina un nodo del árbol. Complejidad: O(log n) en promedio',
            complexity: 'O(log n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Traverse',
            format: ContentFormat.text,
            description: 'Recorre todos los nodos del árbol. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Height',
            format: ContentFormat.text,
            description: 'Calcula la altura del árbol. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Bases de datos y sistemas de archivos',
            description: 'Los BST se usan para organizar y buscar datos de manera eficiente.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Implementación de diccionarios',
            description: 'Permiten búsquedas rápidas de claves y valores.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Autocompletado',
            description: 'Estructuras de árbol se usan para sugerir palabras o rutas.',
          },
          {
            contentType: DataStructureContentType.resource,
            name: 'VisuAlgo BST',
            format: ContentFormat.link,
            description: 'https://visualgo.net/en/bst',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Hierarchical Structure',
            format: ContentFormat.text,
            description: 'Un árbol binario de búsqueda es una estructura jerárquica donde cada nodo tiene como máximo dos hijos.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Sorted Order',
            format: ContentFormat.text,
            description: 'Los elementos están organizados de tal manera que para cada nodo, los valores del subárbol izquierdo son menores y los del derecho son mayores.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description: 'Búsqueda, inserción y eliminación: O(log n) en promedio, O(n) en el peor caso.',
            complexity: 'O(log n)',
          },
        ],
      },
    },
  });

  // Create hash table data structure
  const hashTable = await prisma.dataStructure.create({
    data: {
      title: 'Tabla Hash',
      slug: 'tabla-hash',
      description: 'Estructura de datos que mapea claves a valores usando una función hash.',
      difficulty: DataStructureDifficulty.intermedio,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Tabla Hash',
            format: ContentFormat.text,
            description: 'Una tabla hash es una estructura de datos que implementa un array asociativo...',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description: 'Inserta un par clave-valor en la tabla. Complejidad: O(1) en promedio',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Search',
            format: ContentFormat.text,
            description: 'Busca un valor por su clave. Complejidad: O(1) en promedio',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description: 'Elimina un par clave-valor de la tabla. Complejidad: O(1) en promedio',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Hash',
            format: ContentFormat.text,
            description: 'Aplica la función hash a una clave. Complejidad: O(k) donde k es la longitud de la clave',
            complexity: 'O(k)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Resize',
            format: ContentFormat.text,
            description: 'Redimensiona la tabla hash. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Tablas de símbolos en compiladores',
            description: 'Las tablas hash almacenan identificadores y variables.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Implementación de diccionarios',
            description: 'Permiten búsquedas rápidas de claves y valores.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Cachés',
            description: 'Las tablas hash se usan para implementar cachés de datos.',
          },
          {
            contentType: DataStructureContentType.resource,
            name: 'VisuAlgo Hash Table',
            format: ContentFormat.link,
            description: 'https://visualgo.net/en/hashtable',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Key-Value Structure',
            format: ContentFormat.text,
            description: 'Una tabla hash almacena pares clave-valor y utiliza una función hash para determinar la posición de almacenamiento.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Efficient Lookup',
            format: ContentFormat.text,
            description: 'Permite búsquedas, inserciones y eliminaciones eficientes en promedio.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description: 'Búsqueda, inserción y eliminación: O(1) en promedio, O(n) en el peor caso.',
            complexity: 'O(1)',
          },
        ],
      },
    },
  });

  console.log({
    admin,
    teacher,
    student,
    queue,
    stack,
    linkedList,
    doubleLinkedList,
    circularLinkedList,
    bst,
    hashTable,
  });

  console.log('Sample quizzes created:', { stackQuiz: stackQuiz.id, queueQuiz: queueQuiz.id });

  console.log('🌱  The seed command has been executed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
