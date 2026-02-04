import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
    console.log('✅ Database seeded successfully');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
