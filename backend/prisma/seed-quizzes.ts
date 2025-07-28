import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding quizzes...');

  // Get existing data structures
  const dataStructures = await prisma.dataStructure.findMany({
    select: { id: true, slug: true, title: true },
  });

  if (dataStructures.length === 0) {
    console.log(
      '❌ No data structures found. Please seed data structures first.',
    );
    return;
  }

  // Clear existing quizzes
  await prisma.quiz.deleteMany();
  console.log('🧹 Cleared existing quizzes');

  // Get a user to be the creator
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('❌ No users found. Please seed users first.');
    return;
  }

  const quizTemplates: Record<string, any[]> = {
    pilas: [
      {
        title: 'Fundamentos de Pilas - Básico',
        description:
          'Cuestionario básico sobre pilas y sus operaciones fundamentales',
        difficulty: 'principiante' as const,
        questions: [
          {
            questionText: '¿Cuál es el principio fundamental de una pila?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'FIFO (First In, First Out)', isCorrect: false },
              { optionText: 'LIFO (Last In, First Out)', isCorrect: true },
              { optionText: 'Acceso aleatorio', isCorrect: false },
              { optionText: 'Basado en prioridad', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué operación se usa para agregar un elemento a una pila?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'pop()', isCorrect: false },
              { optionText: 'push()', isCorrect: true },
              { optionText: 'enqueue()', isCorrect: false },
              { optionText: 'dequeue()', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué operación se usa para eliminar y retornar el elemento superior de una pila?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'push()', isCorrect: false },
              { optionText: 'pop()', isCorrect: true },
              { optionText: 'peek()', isCorrect: false },
              { optionText: 'top()', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la complejidad temporal de las operaciones push() y pop() en una pila?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'O(n)', isCorrect: false },
              { optionText: 'O(1)', isCorrect: true },
              { optionText: 'O(log n)', isCorrect: false },
              { optionText: 'O(n²)', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué estructura de datos se utiliza comúnmente para implementar una pila?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Lista enlazada', isCorrect: false },
              { optionText: 'Array', isCorrect: true },
              { optionText: 'Árbol binario', isCorrect: false },
              { optionText: 'Grafo', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Aplicaciones de Pilas - Intermedio',
        description: 'Cuestionario sobre aplicaciones prácticas de las pilas',
        difficulty: 'intermedio' as const,
        questions: [
          {
            questionText:
              '¿Cuál de las siguientes es una aplicación común de las pilas?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'Evaluación de expresiones matemáticas',
                isCorrect: true,
              },
              { optionText: 'Ordenamiento de datos', isCorrect: false },
              { optionText: 'Búsqueda en grafos', isCorrect: false },
              { optionText: 'Compresión de datos', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué algoritmo utiliza pilas para recorrer un árbol?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Búsqueda en profundidad (DFS)', isCorrect: true },
              { optionText: 'Búsqueda en anchura (BFS)', isCorrect: false },
              { optionText: 'Ordenamiento por inserción', isCorrect: false },
              { optionText: 'Búsqueda binaria', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Para qué se utilizan las pilas en los navegadores web?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Historial de navegación', isCorrect: true },
              { optionText: 'Almacenamiento de cookies', isCorrect: false },
              { optionText: 'Caché de imágenes', isCorrect: false },
              { optionText: 'Compresión de páginas', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué sucede cuando intentas hacer pop() en una pila vacía?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Se retorna null', isCorrect: false },
              { optionText: 'Se lanza una excepción', isCorrect: true },
              { optionText: 'Se retorna 0', isCorrect: false },
              { optionText: 'Se crea un nuevo elemento', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la ventaja principal de usar una pila sobre un array para ciertas operaciones?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'Acceso más rápido a cualquier elemento',
                isCorrect: false,
              },
              {
                optionText:
                  'Operaciones de inserción y eliminación más eficientes',
                isCorrect: true,
              },
              { optionText: 'Menor uso de memoria', isCorrect: false },
              { optionText: 'Ordenamiento automático', isCorrect: false },
            ],
          },
        ],
      },
    ],
    colas: [
      {
        title: 'Fundamentos de Colas - Básico',
        description:
          'Cuestionario básico sobre colas y sus operaciones fundamentales',
        difficulty: 'principiante' as const,
        questions: [
          {
            questionText: '¿Cuál es el principio fundamental de una cola?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'FIFO (First In, First Out)', isCorrect: true },
              { optionText: 'LIFO (Last In, First Out)', isCorrect: false },
              { optionText: 'Acceso aleatorio', isCorrect: false },
              { optionText: 'Basado en prioridad', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué operación se usa para agregar un elemento al final de una cola?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'dequeue()', isCorrect: false },
              { optionText: 'enqueue()', isCorrect: true },
              { optionText: 'push()', isCorrect: false },
              { optionText: 'pop()', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué operación se usa para eliminar y retornar el primer elemento de una cola?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'enqueue()', isCorrect: false },
              { optionText: 'dequeue()', isCorrect: true },
              { optionText: 'front()', isCorrect: false },
              { optionText: 'back()', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la complejidad temporal de las operaciones enqueue() y dequeue() en una cola?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'O(n)', isCorrect: false },
              { optionText: 'O(1)', isCorrect: true },
              { optionText: 'O(log n)', isCorrect: false },
              { optionText: 'O(n²)', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué estructura de datos se utiliza comúnmente para implementar una cola?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Lista enlazada', isCorrect: true },
              { optionText: 'Array', isCorrect: false },
              { optionText: 'Árbol binario', isCorrect: false },
              { optionText: 'Grafo', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Aplicaciones de Colas - Intermedio',
        description: 'Cuestionario sobre aplicaciones prácticas de las colas',
        difficulty: 'intermedio' as const,
        questions: [
          {
            questionText:
              '¿Cuál de las siguientes es una aplicación común de las colas?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Sistema de impresión', isCorrect: true },
              { optionText: 'Evaluación de expresiones', isCorrect: false },
              { optionText: 'Ordenamiento de datos', isCorrect: false },
              { optionText: 'Búsqueda en profundidad', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué algoritmo utiliza colas para recorrer un árbol?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Búsqueda en anchura (BFS)', isCorrect: true },
              { optionText: 'Búsqueda en profundidad (DFS)', isCorrect: false },
              { optionText: 'Ordenamiento por inserción', isCorrect: false },
              { optionText: 'Búsqueda binaria', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Para qué se utilizan las colas en los sistemas operativos?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Planificación de procesos', isCorrect: true },
              { optionText: 'Gestión de memoria', isCorrect: false },
              { optionText: 'Control de archivos', isCorrect: false },
              { optionText: 'Gestión de usuarios', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué sucede cuando intentas hacer dequeue() en una cola vacía?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Se retorna null', isCorrect: false },
              { optionText: 'Se lanza una excepción', isCorrect: true },
              { optionText: 'Se retorna 0', isCorrect: false },
              { optionText: 'Se crea un nuevo elemento', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la diferencia principal entre una cola y una pila?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'Una cola usa FIFO, una pila usa LIFO',
                isCorrect: true,
              },
              { optionText: 'Una cola es más rápida', isCorrect: false },
              { optionText: 'Una pila usa menos memoria', isCorrect: false },
              {
                optionText: 'Una cola puede tener elementos duplicados',
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
    'lista-enlazada-simple': [
      {
        title: 'Fundamentos de Listas Enlazadas Simples - Básico',
        description: 'Cuestionario básico sobre listas enlazadas simples',
        difficulty: 'principiante' as const,
        questions: [
          {
            questionText: '¿Qué es un nodo en una lista enlazada simple?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Solo un valor', isCorrect: false },
              {
                optionText: 'Un valor y un puntero al siguiente nodo',
                isCorrect: true,
              },
              { optionText: 'Solo un puntero', isCorrect: false },
              { optionText: 'Un array de valores', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la complejidad temporal para insertar al inicio de una lista enlazada simple?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'O(n)', isCorrect: false },
              { optionText: 'O(1)', isCorrect: true },
              { optionText: 'O(log n)', isCorrect: false },
              { optionText: 'O(n²)', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la complejidad temporal para buscar un elemento en una lista enlazada simple?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'O(1)', isCorrect: false },
              { optionText: 'O(n)', isCorrect: true },
              { optionText: 'O(log n)', isCorrect: false },
              { optionText: 'O(n²)', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué apunta el último nodo de una lista enlazada simple?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Al primer nodo', isCorrect: false },
              { optionText: 'A NULL', isCorrect: true },
              { optionText: 'Al nodo anterior', isCorrect: false },
              { optionText: 'A sí mismo', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la ventaja principal de una lista enlazada simple sobre un array?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'Acceso más rápido a cualquier elemento',
                isCorrect: false,
              },
              {
                optionText: 'Inserción y eliminación más eficientes',
                isCorrect: true,
              },
              { optionText: 'Menor uso de memoria', isCorrect: false },
              { optionText: 'Ordenamiento automático', isCorrect: false },
            ],
          },
        ],
      },
    ],
    'lista-enlazada-doble': [
      {
        title: 'Listas Enlazadas Dobles - Intermedio',
        description: 'Cuestionario sobre listas enlazadas dobles',
        difficulty: 'intermedio' as const,
        questions: [
          {
            questionText: '¿Qué característica tiene una lista enlazada doble?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'Cada nodo tiene punteros al anterior y siguiente',
                isCorrect: true,
              },
              {
                optionText: 'Solo tiene punteros hacia adelante',
                isCorrect: false,
              },
              {
                optionText: 'El último nodo apunta al primero',
                isCorrect: false,
              },
              { optionText: 'Tiene múltiples punteros', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la complejidad temporal para eliminar un nodo en una lista enlazada doble?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'O(1) si se conoce la posición', isCorrect: true },
              { optionText: 'O(n) siempre', isCorrect: false },
              { optionText: 'O(log n)', isCorrect: false },
              { optionText: 'O(n²)', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué ventaja tiene una lista enlazada doble sobre una simple?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Navegación bidireccional', isCorrect: true },
              { optionText: 'Menor uso de memoria', isCorrect: false },
              { optionText: 'Acceso más rápido', isCorrect: false },
              { optionText: 'Ordenamiento automático', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la aplicación más común de las listas enlazadas dobles?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'Navegadores web (adelante/atrás)',
                isCorrect: true,
              },
              { optionText: 'Ordenamiento de datos', isCorrect: false },
              { optionText: 'Búsqueda binaria', isCorrect: false },
              { optionText: 'Compresión de datos', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué desventaja tiene una lista enlazada doble comparada con una simple?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Mayor uso de memoria por nodo', isCorrect: true },
              { optionText: 'Es más lenta', isCorrect: false },
              { optionText: 'No puede crecer', isCorrect: false },
              { optionText: 'No permite acceso aleatorio', isCorrect: false },
            ],
          },
        ],
      },
    ],
    'lista-enlazada-circular': [
      {
        title: 'Listas Enlazadas Circulares - Intermedio',
        description: 'Cuestionario sobre listas enlazadas circulares',
        difficulty: 'intermedio' as const,
        questions: [
          {
            questionText:
              '¿Qué característica tiene una lista enlazada circular?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'El último nodo apunta al primero',
                isCorrect: true,
              },
              { optionText: 'Cada nodo apunta a dos nodos', isCorrect: false },
              { optionText: 'No tiene fin', isCorrect: false },
              { optionText: 'Es infinita', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la ventaja principal de una lista enlazada circular?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Permite recorrido infinito', isCorrect: true },
              { optionText: 'Menor uso de memoria', isCorrect: false },
              { optionText: 'Acceso más rápido', isCorrect: false },
              { optionText: 'Ordenamiento automático', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿En qué aplicación se usa comúnmente una lista enlazada circular?',
            questionType: 'multiple_choice' as const,
            options: [
              {
                optionText: 'Planificación de procesos (round-robin)',
                isCorrect: true,
              },
              { optionText: 'Búsqueda binaria', isCorrect: false },
              { optionText: 'Compresión de datos', isCorrect: false },
              { optionText: 'Ordenamiento de arrays', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Qué apunta el último nodo de una lista enlazada circular?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'Al primer nodo', isCorrect: true },
              { optionText: 'A NULL', isCorrect: false },
              { optionText: 'Al nodo anterior', isCorrect: false },
              { optionText: 'A sí mismo', isCorrect: false },
            ],
          },
          {
            questionText:
              '¿Cuál es la complejidad temporal para verificar si una lista es circular?',
            questionType: 'multiple_choice' as const,
            options: [
              { optionText: 'O(1)', isCorrect: true },
              { optionText: 'O(n)', isCorrect: false },
              { optionText: 'O(log n)', isCorrect: false },
              { optionText: 'O(n²)', isCorrect: false },
            ],
          },
        ],
      },
    ],
    // 'tabla-hash': [
    //   {
    //     title: 'Fundamentos de Tablas Hash - Básico',
    //     description: 'Cuestionario básico sobre tablas hash',
    //     difficulty: 'intermedio' as const,
    //     questions: [
    //       {
    //         questionText: '¿Cuál es la principal ventaja de una tabla hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Acceso rápido a los datos', isCorrect: true },
    //           { optionText: 'Ordenamiento automático', isCorrect: false },
    //           { optionText: 'Estructura jerárquica', isCorrect: false },
    //           { optionText: 'Uso de memoria mínimo', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText: '¿Qué operación es fundamental en una tabla hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Hashing', isCorrect: true },
    //           { optionText: 'Merge', isCorrect: false },
    //           { optionText: 'Split', isCorrect: false },
    //           { optionText: 'Sort', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Cuál es la complejidad temporal promedio para buscar en una tabla hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'O(1)', isCorrect: true },
    //           { optionText: 'O(n)', isCorrect: false },
    //           { optionText: 'O(log n)', isCorrect: false },
    //           { optionText: 'O(n²)', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText: '¿Qué es una colisión en una tabla hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           {
    //             optionText: 'Dos claves diferentes producen el mismo hash',
    //             isCorrect: true,
    //           },
    //           { optionText: 'La tabla está llena', isCorrect: false },
    //           { optionText: 'Un error en el algoritmo', isCorrect: false },
    //           { optionText: 'Una clave duplicada', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Cuál es el peor caso de complejidad temporal para buscar en una tabla hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'O(1)', isCorrect: false },
    //           { optionText: 'O(n)', isCorrect: true },
    //           { optionText: 'O(log n)', isCorrect: false },
    //           { optionText: 'O(n²)', isCorrect: false },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Manejo de Colisiones - Avanzado',
    //     description:
    //       'Cuestionario sobre técnicas de manejo de colisiones en tablas hash',
    //     difficulty: 'avanzado' as const,
    //     questions: [
    //       {
    //         questionText: '¿Cuál es una técnica común para manejar colisiones?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Encadenamiento', isCorrect: true },
    //           { optionText: 'Ordenamiento', isCorrect: false },
    //           { optionText: 'Compresión', isCorrect: false },
    //           { optionText: 'División', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText: '¿Qué es el sondeo lineal en tablas hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           {
    //             optionText: 'Buscar la siguiente posición disponible',
    //             isCorrect: true,
    //           },
    //           { optionText: 'Reorganizar toda la tabla', isCorrect: false },
    //           { optionText: 'Eliminar elementos duplicados', isCorrect: false },
    //           { optionText: 'Comprimir los datos', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Cuál es la función de carga (load factor) de una tabla hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           {
    //             optionText: 'Número de elementos / tamaño de la tabla',
    //             isCorrect: true,
    //           },
    //           { optionText: 'Número de colisiones', isCorrect: false },
    //           { optionText: 'Tamaño de la tabla', isCorrect: false },
    //           { optionText: 'Número de buckets vacíos', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText: '¿Qué sucede cuando la función de carga es muy alta?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Aumentan las colisiones', isCorrect: true },
    //           { optionText: 'La tabla se hace más rápida', isCorrect: false },
    //           { optionText: 'Se reduce el uso de memoria', isCorrect: false },
    //           {
    //             optionText: 'Los elementos se ordenan automáticamente',
    //             isCorrect: false,
    //           },
    //         ],
    //       },
    //       {
    //         questionText: '¿Cuál es una aplicación común de las tablas hash?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Implementación de diccionarios', isCorrect: true },
    //           { optionText: 'Ordenamiento de datos', isCorrect: false },
    //           { optionText: 'Búsqueda en árboles', isCorrect: false },
    //           { optionText: 'Compresión de archivos', isCorrect: false },
    //         ],
    //       },
    //     ],
    //   },
    // ],
    // 'arbol-binario': [
    //   {
    //     title: 'Fundamentos de Árboles Binarios - Básico',
    //     description: 'Cuestionario básico sobre árboles binarios',
    //     difficulty: 'intermedio' as const,
    //     questions: [
    //       {
    //         questionText:
    //           '¿Cuántos hijos puede tener como máximo un nodo en un árbol binario?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: '1', isCorrect: false },
    //           { optionText: '2', isCorrect: true },
    //           { optionText: '3', isCorrect: false },
    //           { optionText: 'Ilimitados', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Cuál es el recorrido en el que se visita primero la raíz, luego el subárbol izquierdo y después el derecho?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Inorden', isCorrect: false },
    //           { optionText: 'Preorden', isCorrect: true },
    //           { optionText: 'Postorden', isCorrect: false },
    //           { optionText: 'Nivel', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText: '¿Qué es un nodo hoja en un árbol binario?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Un nodo sin hijos', isCorrect: true },
    //           { optionText: 'Un nodo con un solo hijo', isCorrect: false },
    //           { optionText: 'El nodo raíz', isCorrect: false },
    //           { optionText: 'Un nodo con dos hijos', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText: '¿Cuál es la altura de un árbol binario?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Número total de nodos', isCorrect: false },
    //           {
    //             optionText:
    //               'Número de niveles desde la raíz hasta la hoja más lejana',
    //             isCorrect: true,
    //           },
    //           { optionText: 'Número de hojas', isCorrect: false },
    //           { optionText: 'Número de nodos internos', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Cuál es la complejidad temporal para buscar en un árbol binario balanceado?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'O(1)', isCorrect: false },
    //           { optionText: 'O(log n)', isCorrect: true },
    //           { optionText: 'O(n)', isCorrect: false },
    //           { optionText: 'O(n²)', isCorrect: false },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Tipos de Árboles Binarios - Intermedio',
    //     description: 'Cuestionario sobre diferentes tipos de árboles binarios',
    //     difficulty: 'intermedio' as const,
    //     questions: [
    //       {
    //         questionText:
    //           '¿Qué característica tiene un árbol binario de búsqueda (BST)?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           {
    //             optionText:
    //               'Los valores del subárbol izquierdo son menores que la raíz',
    //             isCorrect: true,
    //           },
    //           {
    //             optionText: 'Todos los nodos tienen el mismo valor',
    //             isCorrect: false,
    //           },
    //           { optionText: 'Solo tiene nodos hoja', isCorrect: false },
    //           { optionText: 'Es siempre completo', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText: '¿Qué es un árbol binario completo?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           {
    //             optionText:
    //               'Todos los niveles están llenos excepto posiblemente el último',
    //             isCorrect: true,
    //           },
    //           {
    //             optionText: 'Todos los nodos tienen dos hijos',
    //             isCorrect: false,
    //           },
    //           { optionText: 'Solo tiene nodos hoja', isCorrect: false },
    //           { optionText: 'Es perfectamente balanceado', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Cuál es la ventaja de un árbol AVL sobre un BST normal?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           {
    //             optionText: 'Se mantiene balanceado automáticamente',
    //             isCorrect: true,
    //           },
    //           { optionText: 'Usa menos memoria', isCorrect: false },
    //           { optionText: 'Es más fácil de implementar', isCorrect: false },
    //           { optionText: 'Permite valores duplicados', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Qué recorrido de un BST produce una secuencia ordenada?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Inorden', isCorrect: true },
    //           { optionText: 'Preorden', isCorrect: false },
    //           { optionText: 'Postorden', isCorrect: false },
    //           { optionText: 'Nivel', isCorrect: false },
    //         ],
    //       },
    //       {
    //         questionText:
    //           '¿Cuál es la aplicación más común de los árboles binarios?',
    //         questionType: 'multiple_choice' as const,
    //         options: [
    //           { optionText: 'Búsqueda eficiente de datos', isCorrect: true },
    //           { optionText: 'Ordenamiento de datos', isCorrect: false },
    //           { optionText: 'Compresión de archivos', isCorrect: false },
    //           { optionText: 'Cifrado de datos', isCorrect: false },
    //         ],
    //       },
    //     ],
    //   },
    // ],
  };

  // Create quizzes for each data structure
  for (const ds of dataStructures) {
    const templates = quizTemplates[ds.slug];
    if (templates) {
      console.log(`📝 Creating quizzes for ${ds.title}...`);
      for (const template of templates) {
        await prisma.quiz.create({
          data: {
            title: template.title,
            description: template.description,
            difficulty: template.difficulty,
            dataStructureId: ds.id,
            createdBy: user.id,
            questions: {
              create: template.questions.map((q: any, index: number) => ({
                questionText: q.questionText,
                questionType: q.questionType,
                order: index + 1,
                options: {
                  create: q.options.map((o: any, optIndex: number) => ({
                    optionText: o.optionText,
                    isCorrect: o.isCorrect,
                    order: optIndex + 1,
                  })),
                },
              })),
            },
          },
        });
        console.log(`✅ Created quiz: ${template.title}`);
      }
    } else {
      console.log(`⚠️ No templates found for ${ds.slug}, skipping...`);
    }
  }

  console.log('✅ Quizzes seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding quizzes:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch((e) => {
      console.error('Error disconnecting from Prisma:', e);
    });
  });
