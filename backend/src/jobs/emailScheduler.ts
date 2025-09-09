import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendPremiereReminderEmail } from '../api/services/email.service.js';

const prisma = new PrismaClient();

const checkMoviePremieres = async () => {
  console.log('Running daily check for movie premieres...');

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    const moviesPremieringToday = await prisma.movie.findMany({
      where: {
        releaseDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        user: true, // Incluímos os dados do usuário dono do filme
      },
    });

    if (moviesPremieringToday.length === 0) {
      console.log('No movies premiering today.');
      return;
    }

    console.log(`Found ${moviesPremieringToday.length} movies premiering today. Sending emails...`);

    for (const movie of moviesPremieringToday) {
      // Supondo que você criará uma função sendPremiereReminderEmail no seu email.service.ts
      await sendPremiereReminderEmail(movie.user.email, movie.title);
    }
  } catch (error) {
    console.error('Error checking for movie premieres:', error);
  }
};

// Agenda a tarefa para rodar todos os dias às 8:00 da manhã
export const startPremiereCheckJob = () => {
  cron.schedule('0 8 * * *', checkMoviePremieres, {
    timezone: "America/Sao_Paulo"
  });
  console.log('Movie premiere email job scheduled to run daily at 8:00 AM (Sao Paulo time).');
};
