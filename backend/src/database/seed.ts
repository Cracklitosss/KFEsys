import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

export async function seedDatabase(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryRunner.query(
      `INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)`,
      ['admin@kfe.com', hashedPassword, 'Administrador KFE', 'admin'],
    );

    await queryRunner.query(
      `INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)`,
      ['cajero@kfe.com', hashedPassword, 'Cajero KFE', 'cashier'],
    );

    await queryRunner.query(
      `INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)`,
      ['gerente@kfe.com', hashedPassword, 'Gerente KFE', 'manager'],
    );

    await queryRunner.query(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      ['Bebidas Calientes', 'Café, té y bebidas calientes'],
    );

    await queryRunner.query(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      ['Bebidas Frías', 'Jugos, refrescos y bebidas frías'],
    );

    await queryRunner.query(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      ['Alimentos', 'Sándwiches, pasteles y snacks'],
    );

    await queryRunner.query(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      ['Postres', 'Postres y dulces'],
    );

    await queryRunner.commitTransaction();
    console.log('[SUCCESS] Database seeded successfully');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('[ERROR] Error seeding database:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// Ejecutar seed standalone
async function runSeed() {
  if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USERNAME || 
      !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    console.error('[ERROR] Missing required environment variables. Please check your .env file.');
    console.error('Required: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE');
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: ['src/**/*.entity.ts'],
  });

  try {
    await dataSource.initialize();
    console.log('[INFO] Database connection established');
    await seedDatabase(dataSource);
    await dataSource.destroy();
    console.log('[INFO] Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Seed failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed();
}
