/**
 * AI Portfolio — 누적형 프로젝트 데이터 단일 출처.
 * 목록·홈 대표항목·상세·사이트맵이 모두 이 레코드에서 생성된다.
 * UI 파일에 프로젝트명을 하드코딩하지 않는다.
 *
 * 공개 규칙(요청서 §5.3, §5.5)
 * - stage 는 증거와 확인일이 있을 때만 값을 갖는다. 미확인이면 null 이고 화면에 배지를 만들지 않는다.
 * - publication 이 'published' 인 레코드만 공개 HTML·목록·사이트맵에 나온다.
 * - 내부 승인 메모는 이 파일에 두지 않는다.
 */

export type ProjectKind = '자체 서비스' | '개발 참여 프로젝트' | '실험';
export type ProjectStage = '구상' | '프로토타입' | '개발 중' | '베타' | '공개 운영' | '종료';
export type Publication = 'draft' | 'published' | 'archived';
export type VisualType = 'brand-image' | 'product-capture' | 'none';

export type Project = {
  slug: string;
  name: string;
  summary: string;
  category: string;
  kind: ProjectKind | null;
  stage: ProjectStage | null;
  stageVerifiedAt: string | null;
  publication: Publication;
  featured: boolean;
  sortOrder: number;
  coverAssetId: 'A09' | 'A10' | null;
  coverAlt: string;
  visualType: VisualType;
  externalUrl: string | null;
  externalLinkVerifiedAt: string | null;
  contribution: string | null;
  operatorLabel: string | null;
  problem: string[];
  approach: string[];
  /** 승인된 이름 있는 블록(맘이음의 세 가지 역할 등) */
  highlights: { title: string; body: string }[];
  /** 설계 원칙 등 단일 블록 */
  principle: { title: string; body: string } | null;
  implementedFeatures: string[];
  plannedFeatures: string[];
  aiRole: string[];
  validationNotes: string[];
  currentStageNote: string;
  sourceRefs: { label: string; note: string }[];
  reviewedAt: string;
  publicationApproved: boolean;
};

export const projects: Project[] = [
  {
    slug: 'mom-ie',
    name: '맘이음',
    summary: '친구처럼 곁에 있고, 비서처럼 도와주고, 가족과 연결해주는 AI.',
    category: '가족 소통 AI',
    kind: '자체 서비스',
    stage: '개발 중',
    stageVerifiedAt: '2026-09-06',
    publication: 'published',
    featured: true,
    sortOrder: 1,
    coverAssetId: 'A10',
    coverAlt: '',
    visualType: 'brand-image',
    externalUrl: null,
    externalLinkVerifiedAt: null,
    contribution: '기획·설계·개발',
    operatorLabel: null,
    problem: [
      '부모님과의 대화는 안부를 묻는 짧은 통화에서 끝나기 쉽습니다.',
      '가족은 부모님의 하루를 궁금해하지만, 무엇을 물어야 할지 알기 어렵습니다.',
    ],
    approach: [
      '부모님이 말로 편하게 이야기할 수 있는 대화 상대를 먼저 만듭니다.',
      '지난 이야기에서 자연스럽게 이어지는 대화를 지향합니다.',
    ],
    highlights: [
      { title: '친구처럼 곁에', body: '부모님의 일상과 관심사를 나누고, 지난 이야기에서 자연스럽게 이어지는 대화를 지향합니다.' },
      { title: '비서처럼 도움을', body: '일정과 생활의 작은 부탁을 말로 쉽게 요청하고 도움받을 수 있는 경험을 준비합니다.' },
      { title: '가족과 연결되도록', body: '부모님의 의사를 존중하면서, 가족이 안부를 이해하고 대화를 시작할 계기를 만드는 것이 목표입니다.' },
    ],
    principle: {
      title: '가까워지기 위해, 지켜야 할 경계도 생각합니다.',
      body: '부모님을 감시하거나 가족의 대화를 대신하기보다, 사람 사이의 연결을 돕는 방향으로 설계합니다. 공유 범위와 개인정보, AI가 도울 수 있는 일의 한계를 함께 고려합니다.',
    },
    implementedFeatures: [],
    plannedFeatures: [
      '일상과 관심사를 나누는 대화 경험',
      '일정과 생활의 작은 부탁을 말로 요청하는 도움 기능',
      '가족이 안부를 이해하고 대화를 시작할 계기 제공',
    ],
    aiRole: [
      '부모님의 발화를 입력으로 받아 맥락을 유지한 대화를 이어갑니다.',
      '구체적인 모델 구성과 처리 범위는 개발·검증 과정에서 확정합니다.',
    ],
    validationNotes: [
      '개발 및 검증 과정에 있으며, 기능과 제공 범위는 달라질 수 있습니다.',
    ],
    currentStageNote: '개발 중입니다. 공개 베타·상용 운영·유료 서비스·이용자 수는 확인 전까지 표시하지 않습니다.',
    sourceRefs: [{ label: '휴미즈 내부 프로젝트', note: '승인된 공개 문구 기준' }],
    reviewedAt: '2026-09-06',
    publicationApproved: true,
  },
  {
    slug: 'anybuild',
    name: 'AnyBuild',
    summary: '아이디어를 서비스 기획과 구현으로 연결하는 AI 프로젝트.',
    category: '서비스 기획·구현',
    kind: null,
    stage: null,
    stageVerifiedAt: null,
    publication: 'published',
    featured: true,
    sortOrder: 2,
    coverAssetId: 'A09',
    coverAlt: '',
    visualType: 'brand-image',
    externalUrl: 'https://anybuild.humease.com/',
    externalLinkVerifiedAt: '2026-09-06',
    contribution: null,
    operatorLabel: null,
    problem: ['아이디어 단계의 서비스 구상을 실제 만들 수 있는 형태로 정리하기 어렵습니다.'],
    approach: ['아이디어를 서비스 기획과 구현 단계로 연결하는 흐름을 다룹니다.'],
    highlights: [],
    principle: null,
    implementedFeatures: [],
    plannedFeatures: [],
    aiRole: [],
    validationNotes: [],
    currentStageNote: '기존 홈페이지 포트폴리오에 등록된 프로젝트입니다. 현재 운영 단계와 제공 기능은 확인 후 표기합니다.',
    sourceRefs: [{ label: '구 홈페이지 public/data/ai-services.json', note: '등록 사실 확인 2026-09-06' }],
    reviewedAt: '2026-09-06',
    publicationApproved: true,
  },
  {
    slug: 'hairai',
    name: 'HairAI',
    summary: '사진을 바탕으로 어울리는 헤어스타일을 살펴보는 AI 프로젝트.',
    category: '이미지 기반 추천',
    kind: null,
    stage: null,
    stageVerifiedAt: null,
    publication: 'published',
    featured: true,
    sortOrder: 3,
    coverAssetId: null,
    coverAlt: '',
    visualType: 'none',
    externalUrl: 'https://hairai.humease.com/',
    externalLinkVerifiedAt: '2026-09-06',
    contribution: null,
    operatorLabel: null,
    problem: ['헤어스타일을 바꾸기 전에 어울릴지 미리 가늠하기 어렵습니다.'],
    approach: ['사진을 바탕으로 어울리는 스타일을 살펴보는 경험을 다룹니다.'],
    highlights: [],
    principle: null,
    implementedFeatures: [],
    plannedFeatures: [],
    aiRole: [],
    validationNotes: [],
    currentStageNote: '기존 홈페이지 포트폴리오에 등록된 프로젝트입니다. 현재 운영 단계와 분석 정확도는 확인 후 표기합니다.',
    sourceRefs: [{ label: '구 홈페이지 public/data/ai-services.json', note: '등록 사실 확인 2026-09-06' }],
    reviewedAt: '2026-09-06',
    publicationApproved: true,
  },
  {
    slug: 'k-bestie',
    name: '내친구 케이',
    summary: '아이와 대화하는 AI 친구와 부모를 위한 인사이트를 연결하는 가족 소통 서비스.',
    category: '가족 소통 AI',
    kind: null,
    stage: null,
    stageVerifiedAt: null,
    publication: 'published',
    featured: false,
    sortOrder: 4,
    coverAssetId: null,
    coverAlt: '',
    visualType: 'none',
    externalUrl: 'https://www.k-bestie.com/',
    externalLinkVerifiedAt: '2026-09-06',
    contribution: null,
    operatorLabel: '운영 주체는 별도 확인 대상입니다.',
    problem: ['아이의 마음을 이해하고 대화를 이어가는 계기를 만들기 어렵습니다.'],
    approach: ['아이와 대화하는 AI 친구와, 부모를 위한 인사이트를 연결하는 방향을 다룹니다.'],
    highlights: [],
    principle: null,
    implementedFeatures: [],
    plannedFeatures: [],
    aiRole: [],
    validationNotes: [],
    currentStageNote: '기존 홈페이지 포트폴리오에 등록된 프로젝트입니다. 최신 공개 단계와 운영 주체는 확인 후 표기합니다.',
    sourceRefs: [{ label: '구 홈페이지 public/data/ai-services.json', note: '등록 사실 확인 2026-09-06' }],
    reviewedAt: '2026-09-06',
    publicationApproved: true,
  },
];

/** 공개 레코드만. 목록·상세·사이트맵·홈이 전부 이 함수를 통한다. */
export const publishedProjects = () =>
  projects
    .filter((p) => p.publication === 'published' && p.publicationApproved)
    .sort((a, b) => a.sortOrder - b.sortOrder);

export const featuredProjects = (limit = 3) =>
  publishedProjects().filter((p) => p.featured).slice(0, limit);

export const projectBySlug = (slug: string) =>
  publishedProjects().find((p) => p.slug === slug);
