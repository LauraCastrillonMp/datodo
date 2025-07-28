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
  console.log('🌱  Seeding la base de datos...');

  const passwordAdmin = await bcrypt.hash('admin123', roundsOfHashing);
  const passwordTeacher = await bcrypt.hash('teacher123', roundsOfHashing);
  const passwordStudent = await bcrypt.hash('student123', roundsOfHashing);

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

  const queue = await prisma.dataStructure.upsert({
    where: { slug: 'colas' },
    update: {},
    create: {
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
            description:
              'Agrega un elemento al final de la cola. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Dequeue',
            format: ContentFormat.text,
            description:
              'Elimina y retorna el elemento del frente de la cola. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Peek',
            format: ContentFormat.text,
            description:
              'Retorna el elemento del frente sin eliminarlo. Complejidad: O(1)',
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
            description:
              'Retorna el número de elementos en la cola. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Sistemas de impresión',
            description:
              'Las colas se usan para gestionar trabajos de impresión en orden de llegada.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Búsqueda en anchura (BFS)',
            description:
              'El algoritmo BFS utiliza una cola para recorrer grafos o árboles por niveles.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Simulaciones de colas',
            description:
              'Modelado de líneas de espera en bancos, supermercados, etc.',
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
            description:
              'Una cola es una estructura de datos lineal donde los elementos se procesan en orden FIFO (First-In, First-Out).',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Dynamic Size',
            format: ContentFormat.text,
            description:
              'El tamaño de la cola puede crecer o decrecer dinámicamente según las operaciones de inserción y eliminación.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description:
              'Las operaciones principales (enqueue, dequeue, peek) tienen una complejidad de tiempo O(1).',
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

  const pilas = await prisma.dataStructure.upsert({
    where: { slug: 'pilas' },
    update: {},
    create: {
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
            description:
              'Agrega un elemento en la parte superior de la pila. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Pop',
            format: ContentFormat.text,
            description:
              'Elimina y retorna el elemento de la parte superior de la pila. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Peek',
            format: ContentFormat.text,
            description:
              'Retorna el elemento de la parte superior sin eliminarlo. Complejidad: O(1)',
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
            description:
              'Retorna el número de elementos en la pila. Complejidad: O(1)',
            complexity: 'O(1)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Deshacer/rehacer en editores',
            description:
              'Las pilas permiten implementar funcionalidades de deshacer y rehacer en aplicaciones.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Evaluación de expresiones',
            description:
              'Las pilas se usan para evaluar expresiones matemáticas y convertir notaciones.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Navegadores web (historial)',
            description:
              'El historial de navegación se gestiona como una pila.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Llamadas a funciones (call stack)',
            description:
              'El call stack de un programa es una pila de llamadas a funciones.',
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
            description:
              'Una pila es una estructura de datos lineal que sigue el principio LIFO (Last-In, First-Out).',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Dynamic Size',
            format: ContentFormat.text,
            description:
              'El tamaño de la pila puede crecer o decrecer dinámicamente según las operaciones de inserción y eliminación.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description:
              'Las operaciones principales (push, pop, peek) tienen una complejidad de tiempo O(1).',
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

  const listaEnlazadaSimple = await prisma.dataStructure.upsert({
    where: { slug: 'lista-enlazada-simple' },
    update: {},
    create: {
      title: 'Lista Enlazada Simple',
      slug: 'lista-enlazada-simple',
      description:
        'Estructura de datos lineal donde cada elemento apunta al siguiente.',
      difficulty: DataStructureDifficulty.principiante,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Lista Enlazada Simple',
            format: ContentFormat.text,
            description:
              'Una lista enlazada simple es una estructura de datos lineal donde cada elemento (nodo) contiene datos y una referencia al siguiente nodo. El último nodo apunta a NULL.',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description:
              'Inserta un nuevo nodo en la lista. Complejidad: O(1) para inserción al inicio, O(n) para inserción al final',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description:
              'Elimina un nodo de la lista. Complejidad: O(1) para eliminación al inicio, O(n) para eliminación al final',
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
            description:
              'Recorre todos los elementos de la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description:
              'Retorna el número de nodos en la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Implementación de otras estructuras',
            description:
              'Listas enlazadas se usan para implementar pilas, colas y tablas hash.',
          },
          {
            contentType: DataStructureContentType.application,
            format: ContentFormat.text,
            name: 'Navegadores (páginas adelante/atrás)',
            description:
              'Permiten navegar hacia adelante y atrás en el historial.',
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
            description:
              'Una lista enlazada simple es una estructura de datos dinámica donde cada elemento apunta al siguiente.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Efficient Insert/Delete',
            format: ContentFormat.text,
            description:
              'Permite inserciones y eliminaciones eficientes en cualquier posición, especialmente al inicio.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description:
              'Acceso: O(n), Inserción/Eliminación: O(1) (al inicio), Búsqueda: O(n).',
            complexity: 'O(1) / O(n)',
          },
        ],
      },
    },
  });

  const listaEnlazaDoble = await prisma.dataStructure.upsert({
    where: { slug: 'lista-enlazada-doble' },
    update: {},
    create: {
      title: 'Lista Enlazada Doble',
      slug: 'lista-enlazada-doble',
      description:
        'Estructura de datos lineal donde cada elemento apunta al anterior y al siguiente.',
      difficulty: DataStructureDifficulty.intermedio,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Lista Enlazada Doble',
            format: ContentFormat.text,
            description:
              'Una lista enlazada doble es una estructura de datos lineal donde cada nodo contiene datos, una referencia al nodo anterior y una referencia al nodo siguiente. Permite navegación en ambas direcciones.',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description:
              'Inserta un nuevo nodo en la lista. Complejidad: O(1) para inserción al inicio/final, O(n) para inserción en posición específica',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description:
              'Elimina un nodo de la lista. Complejidad: O(1) si se conoce la posición, O(n) para búsqueda',
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
            description:
              'Recorre todos los elementos de la lista hacia adelante. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Traverse Backward',
            format: ContentFormat.text,
            description:
              'Recorre todos los elementos de la lista hacia atrás. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description:
              'Retorna el número de nodos en la lista. Complejidad: O(n)',
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
            description:
              'Permite navegar hacia adelante y hacia atrás en la lista de manera eficiente.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Efficient Deletion',
            format: ContentFormat.text,
            description:
              'Eliminación más eficiente ya que no necesitamos mantener un puntero al nodo anterior.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Memory Overhead',
            format: ContentFormat.text,
            description:
              'Requiere más memoria por nodo debido a los punteros adicionales.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description:
              'Acceso: O(n), Inserción/Eliminación: O(1) (si se conoce la posición), Búsqueda: O(n).',
            complexity: 'O(1) / O(n)',
          },
        ],
      },
    },
  });

  const listaEnlazadaCircular = await prisma.dataStructure.upsert({
    where: { slug: 'lista-enlazada-circular' },
    update: {},
    create: {
      title: 'Lista Enlazada Circular',
      slug: 'lista-enlazada-circular',
      description:
        'Estructura de datos donde el último elemento apunta al primero, formando un círculo.',
      difficulty: DataStructureDifficulty.intermedio,
      creator: { connect: { id: teacher.id } },
      contents: {
        create: [
          {
            contentType: DataStructureContentType.general,
            name: 'Definición de Lista Enlazada Circular',
            format: ContentFormat.text,
            description:
              'Una lista enlazada circular es una estructura de datos donde el último nodo apunta al primer nodo, formando un círculo. No hay un nodo final que apunte a NULL.',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Insert',
            format: ContentFormat.text,
            description:
              'Inserta un nuevo nodo en la lista. Complejidad: O(1) para inserción al inicio, O(n) para inserción al final',
            complexity: 'O(1) - O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Delete',
            format: ContentFormat.text,
            description:
              'Elimina un nodo de la lista. Complejidad: O(1) para eliminación al inicio, O(n) para eliminación al final',
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
            description:
              'Recorre todos los elementos de la lista. Complejidad: O(n)',
            complexity: 'O(n)',
          },
          {
            contentType: DataStructureContentType.operation,
            name: 'Size',
            format: ContentFormat.text,
            description:
              'Retorna el número de nodos en la lista. Complejidad: O(n)',
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
            description:
              'No hay un nodo final que apunte a NULL, todos los nodos están conectados en un círculo.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Efficient Traversal',
            format: ContentFormat.text,
            description:
              'Permite recorrer la lista infinitamente sin necesidad de reiniciar.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Memory Efficiency',
            format: ContentFormat.text,
            description:
              'No se necesita un puntero especial para el final de la lista.',
          },
          {
            contentType: DataStructureContentType.property,
            name: 'Time Complexity',
            format: ContentFormat.text,
            description:
              'Acceso: O(n), Inserción/Eliminación: O(1) (al inicio), Búsqueda: O(n).',
            complexity: 'O(1) / O(n)',
          },
        ],
      },
    },
  });

  console.log('🌱 Seeding completado');
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
