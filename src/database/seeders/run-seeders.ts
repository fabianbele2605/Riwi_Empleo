import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UserSeeder } from './user.seeder';

async function runSeeders() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const userSeeder = app.get(UserSeeder);
    await userSeeder.seed();
    
    console.log('🌱 All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
  } finally {
    await app.close();
  }
}

runSeeders();