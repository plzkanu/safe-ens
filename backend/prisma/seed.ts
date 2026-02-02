import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시딩 시작...');

  // 사업소 생성
  const site1 = await prisma.site.upsert({
    where: { code: 'SITE001' },
    update: {},
    create: {
      name: '본사',
      code: 'SITE001',
      address: '서울특별시 강남구',
      description: '본사 사업소',
    },
  });

  await prisma.site.upsert({
    where: { code: 'SITE002' },
    update: {},
    create: {
      name: '부산 사업소',
      code: 'SITE002',
      address: '부산광역시 해운대구',
      description: '부산 지역 사업소',
    },
  });

  console.log('✅ 사업소 생성 완료');

  // 관리자 계정 생성
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '시스템 관리자',
      role: 'ADMIN',
    },
  });

  console.log('✅ 관리자 계정 생성 완료');
  console.log(`   이메일: admin@example.com`);
  console.log(`   비밀번호: admin1234`);

  // 사업소 관리자 생성
  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      password: hashedPassword,
      name: '본사 안전담당자',
      role: 'SITE_MANAGER',
      siteId: site1.id,
    },
  });

  console.log('✅ 사업소 관리자 계정 생성 완료');
  console.log(`   이메일: manager@example.com`);
  console.log(`   비밀번호: admin1234`);

  // 관리감독자 생성
  await prisma.user.upsert({
    where: { email: 'supervisor1@example.com' },
    update: {},
    create: {
      email: 'supervisor1@example.com',
      password: hashedPassword,
      name: '김관리',
      role: 'SUPERVISOR',
      siteId: site1.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'supervisor2@example.com' },
    update: {},
    create: {
      email: 'supervisor2@example.com',
      password: hashedPassword,
      name: '이감독',
      role: 'SUPERVISOR',
      siteId: site1.id,
    },
  });

  console.log('✅ 관리감독자 계정 생성 완료');
  console.log(`   이메일: supervisor1@example.com / supervisor2@example.com`);
  console.log(`   비밀번호: admin1234`);

  console.log('');
  console.log('🎉 시딩 완료!');
  console.log('');
  console.log('📝 로그인 정보:');
  console.log('   관리자: admin@example.com / admin1234');
  console.log('   사업소 관리자: manager@example.com / admin1234');
  console.log('   관리감독자: supervisor1@example.com / admin1234');
}

main()
  .catch((e) => {
    console.error('❌ 시딩 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
