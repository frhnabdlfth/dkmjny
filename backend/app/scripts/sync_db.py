from app.db.session import engine
from sqlalchemy import text

def sync_db():
    with engine.connect() as conn:
        try:
            conn.execute(text('ALTER TABLE jadwal_dkm ADD COLUMN tanggal DATE NOT NULL AFTER user_id;'))
            print('Added tanggal to jadwal_dkm')
        except Exception as e:
            print('jadwal_dkm.tanggal might already exist or error:', e)

        try:
            conn.execute(text('ALTER TABLE keuangan MODIFY COLUMN jenis_pemasukan VARCHAR(50) DEFAULT NULL;'))
            conn.execute(text('ALTER TABLE keuangan MODIFY COLUMN jenis_pengeluaran VARCHAR(50) DEFAULT NULL;'))
            print('Modified keuangan table')
        except Exception as e:
            print('keuangan table modification error:', e)
        conn.commit()

if __name__ == "__main__":
    sync_db()
