import { PrismaClient, DataStructureDifficulty, DataStructureContentType, ContentFormat } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding missing linked list types...')

  // Check if double linked list already exists
  const existingDouble = await prisma.dataStructure.findUnique({
    where: { slug: 'lista-enlazada-doble' }
  })

  if (!existingDouble) {
    console.log('Creating double linked list...')
    const doubleLinkedList = await prisma.dataStructure.create({
      data: {
        title: 'Lista Enlazada Doble',
        slug: 'lista-enlazada-doble',
        description: 'Estructura de datos lineal donde cada elemento apunta al anterior y al siguiente.',
        difficulty: DataStructureDifficulty.intermedio,
        creator: { connect: { id: 2 } }, // teacher
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
    })
    console.log('✅ Double linked list created:', doubleLinkedList.title)
  } else {
    console.log('⚠️ Double linked list already exists')
  }

  // Check if circular linked list already exists
  const existingCircular = await prisma.dataStructure.findUnique({
    where: { slug: 'lista-enlazada-circular' }
  })

  if (!existingCircular) {
    console.log('Creating circular linked list...')
    const circularLinkedList = await prisma.dataStructure.create({
      data: {
        title: 'Lista Enlazada Circular',
        slug: 'lista-enlazada-circular',
        description: 'Estructura de datos donde el último elemento apunta al primero, formando un círculo.',
        difficulty: DataStructureDifficulty.intermedio,
        creator: { connect: { id: 2 } }, // teacher
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
    })
    console.log('✅ Circular linked list created:', circularLinkedList.title)
  } else {
    console.log('⚠️ Circular linked list already exists')
  }

  console.log('🌱 Linked list types added successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 