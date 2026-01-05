import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DemoSeeder } from './demo.seeder';

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get('CONNECTION');
  
  const seeder = new DemoSeeder(dataSource);
  await seeder.run();
  
  await app.close();
  process.exit(0);
}

runSeeder().catch(error => {
  console.error('Error running seeder:', error);
  process.exit(1);
});