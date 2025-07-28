import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding achievements...');

  const achievements = [
    {
      name: 'Primer Cuestionario',
      description: 'Completa tu primer cuestionario sobre estructuras de datos',
      category: 'learning' as const,
      rarity: 'common' as const,
      rewardXP: 50,
      maxProgress: 1,
    },
    {
      name: 'Maestro de Cuestionarios',
      description: 'Completa 10 cuestionarios exitosamente',
      category: 'performance' as const,
      rarity: 'rare' as const,
      rewardXP: 200,
      maxProgress: 10,
    },
    {
      name: 'Iniciador de Racha',
      description: 'Mantén una racha de estudio de 3 días consecutivos',
      category: 'streak' as const,
      rarity: 'uncommon' as const,
      rewardXP: 100,
      maxProgress: 3,
    },
    {
      name: 'Estudiante Consistente',
      description: 'Estudia durante 7 días seguidos',
      category: 'streak' as const,
      rarity: 'epic' as const,
      rewardXP: 250,
      maxProgress: 7,
    },
    {
      name: 'Explorador de Estructuras',
      description: 'Aprende 5 estructuras de datos diferentes',
      category: 'learning' as const,
      rarity: 'rare' as const,
      rewardXP: 150,
      maxProgress: 5,
    },
    {
      name: 'Puntuación Perfecta',
      description: 'Obtén 100% en un cuestionario',
      category: 'performance' as const,
      rarity: 'legendary' as const,
      rewardXP: 500,
      maxProgress: 1,
    },
    {
      name: 'Velocista de Datos',
      description: 'Completa un cuestionario en menos de 2 minutos',
      category: 'performance' as const,
      rarity: 'uncommon' as const,
      rewardXP: 75,
      maxProgress: 1,
    },
    {
      name: 'Estudiante Dedicado',
      description: 'Completa 5 cuestionarios en un solo día',
      category: 'learning' as const,
      rarity: 'epic' as const,
      rewardXP: 300,
      maxProgress: 5,
    },
    {
      name: 'Maestro de Pilas',
      description: 'Obtén puntuaciones perfectas en 3 cuestionarios de pilas',
      category: 'learning' as const,
      rarity: 'rare' as const,
      rewardXP: 200,
      maxProgress: 3,
    },
    {
      name: 'Experto en Colas',
      description: 'Obtén puntuaciones perfectas en 3 cuestionarios de colas',
      category: 'learning' as const,
      rarity: 'rare' as const,
      rewardXP: 200,
      maxProgress: 3,
    },
  ];

  await Promise.all(
    achievements.map((achievement) =>
      prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement,
      }),
    ),
  );

  console.log('✅ Achievements seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding achievements:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch((e) => {
      console.error('Error disconnecting from Prisma:', e);
    });
  });
