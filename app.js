/* ==========================================================
   고려가요 <서경별곡> 교육용 웹앱 - 메인 스크립트 (app.js)
   - 3단 탭 전환
   - 50문항 문제은행 풀 & 무작위 10문항 자동 출제 엔진
   - 채점 및 상세 오답 해설 리포트
   - 서경의 여인 DM 인터랙티브 대화형 롤플레잉 게임
   - 시어 사전 모달 & 교실 수업 모드 토글
========================================================== */

// ==========================================================
// 1. 핵심 시어 사전 데이터베이스
// ==========================================================
const WORD_DICTIONARY = {
  '서경': {
    title: '서경 (西京)',
    meaning: '고려 시대의 두 번째 수도였던 서경(현재의 평양).',
    symbol: '화자의 삶의 터전이자 번화하고 아름다운 도시. 화자가 매우 애착을 가진 공간이지만, 님을 따르기 위해서라면 기꺼이 버릴 수 있는 대상입니다.',
    exam: '<가시리>의 소극적이고 순종적인 화자와 달리, 자신의 터전까지 버릴 만큼 님을 사랑하는 적극적이고 능동적인 태도를 보여줍니다.'
  },
  '서울': {
    title: '서울히 마르는',
    meaning: '서울이지마는 / 수도이지마는',
    symbol: '정치·경제·문화의 중심지로서 애정을 지닌 터전임을 나타냅니다.',
    exam: '‘-마르는’은 역접 연결 어미로, 서경을 사랑하지만 님과의 사랑이 더 우선임을 드러냅니다.'
  },
  '닷곤ᄃᆡ': {
    title: '닷곤 ᄃᆡ (닦은 곳)',
    meaning: '새로 중수하고 닦은 곳, 잘 정비된 곳.',
    symbol: '서경 중에서도 새로 정비한 살기 좋은 소성경(小西京)을 의미합니다.',
    exam: '정성껏 가꾸어 온 소중한 생활 터전을 뜻합니다.'
  },
  '쇼셩경': {
    title: '쇼셩경 (小西京)',
    meaning: '작은 서울, 서경(평양)의 별칭.',
    symbol: '화자가 정착하여 살아가던 애착의 공간입니다.',
    exam: '소성경을 사랑하는 마음보다 님을 향한 사랑의 크기가 훨씬 큼을 강조하기 위한 장치입니다.'
  },
  '괴ᄋᆞ옴마ᄅᆞᆫ': {
    title: '괴ᄋᆞ옴마ᄅᆞᆫ (괴오마란)',
    meaning: '사랑하지마는 / 아끼지마는 (괴다 = 사랑하다)',
    symbol: '중세 국어의 대표적 어휘인 ‘괴다(사랑하다)’가 사용된 구절입니다.',
    exam: '‘괴다’는 단순한 호감이 아닌 깊은 애정과 사랑을 뜻하는 고어 빈출 어휘입니다.'
  },
  '여ᄒᆡ므론': {
    title: '여ᄒᆡ므론 (여희므론)',
    meaning: '님과 이별하기보다는 / 헤어지기보다는',
    symbol: '이별의 상황을 맞닥뜨린 화자의 절박함이 드러납니다.',
    exam: '‘여희다’는 ‘이별하다, 헤어지다’의 옛말로, 화자는 이별을 수용하지 않고 단호히 거부합니다.'
  },
  '질삼베': {
    title: '질삼 베 (길쌈 베)',
    meaning: '직접 길쌈하여 짠 피륙(베).',
    symbol: '여성 화자의 생계를 유지해 주는 주요 경제적 수단이자 신분을 짐작하게 하는 소재.',
    exam: '생업의 밑천인 길쌈 베를 버린다는 것은 모든 생계와 사회적 기반을 포기하고라도 님을 따르겠다는 지극한 사랑과 희생을 의미합니다.'
  },
  '괴시란ᄃᆡ': {
    title: '괴시란ᄃᆡ (괴시란대)',
    meaning: '나를 사랑해만 주신다면',
    symbol: '오직 님의 사랑 하나만을 바라는 순수한 연모의 정.',
    exam: '이별을 거부하는 화자의 유일한 조건: 님이 나를 변함없이 사랑해 주는 것.'
  },
  '우러곰': {
    title: '우러곰 (울어곰)',
    meaning: '울면서, 눈물 흘리며 (-곰: 강세 접미사)',
    symbol: '이별의 슬픔과 간절한 심정의 집약.',
    exam: '‘-곰’은 뜻을 강조하는 강세 접미사로, 서럽게 눈물 흘리는 정서를 극대화합니다.'
  },
  '좃ᄂᆞ니이다': {
    title: '좃ᄂᆞ니이다 (좇나니이다)',
    meaning: '따르겠습니다 / 좇아가겠습니다',
    symbol: '이별을 거부하고 님의 뒤를 따르겠다는 능동적·적극적 의지의 표명.',
    exam: '<가시리>의 "가시는 듯 도셔 오쇼셔(체념 후 기다림)"와 대비되는 <서경별곡>만의 독창적이고 저돌적인 태도입니다.'
  },
  '구스리': {
    title: '구스리 (구슬이)',
    meaning: '아름다운 보석 구슬.',
    symbol: '화자와 님 사이의 영원하고 순수한 ‘사랑의 결합(인연)’을 상징합니다.',
    exam: '제2연 구슬가(비유)의 핵심 소재로, 바위에 부딪혀 깨지더라도 끈(믿음)은 남음을 역설합니다.'
  },
  '바회': {
    title: '바회예 (바위에)',
    meaning: '단단하고 험한 바위에.',
    symbol: '두 사람의 사랑을 가로막는 ‘이별의 시련과 가혹한 운명적 역경’을 상징합니다.',
    exam: '구슬과 바위는 연약한 사랑과 거친 시련의 강한 시각적·상징적 대조를 이룹니다.'
  },
  '뎐든': {
    title: '뎐든 (떨어진들)',
    meaning: '떨어진들 / 부딪친들',
    symbol: '시련에 부딪히는 극한의 위기 상황을 가정함.',
    exam: '가정법(-ㄴ들)을 사용하여 어떤 가혹한 상황에서도 사랑이 변치 않음을 강조합니다.'
  },
  '끈': {
    title: '끈이딴 (끈이야)',
    meaning: '구슬을 꿰어 맨 끈이야.',
    symbol: '님을 향한 변치 않는 ‘믿음(신의, 信)’과 마음의 끈.',
    exam: '구슬은 깨질지언정 끈은 끊어지지 않는다는 설의적 표현으로 영원성을 맹세합니다.'
  },
  '그츠리잇가': {
    title: '그츠리잇가 (끊어지겠습니까)',
    meaning: '끊어지겠습니까? (결코 끊어지지 않습니다)',
    symbol: '변치 않는 믿음을 확신에 찬 어조로 선언함.',
    exam: '설의법(반어적 의문)을 통해 신의의 지속성을 강력히 부각합니다.'
  },
  '즈믄ᄒᆡ': {
    title: '즈믄 ᄒᆡ (천 년)',
    meaning: '천(1,000) 년 동안을 (즈믄 = 천, 1000의 순우리말).',
    symbol: '헤어져 홀로 지내야 하는 아득하고 기나긴 고독과 시련의 시간.',
    exam: '과장법과 순우리말 수사(즈믄=1000, 온=100)의 아름다움을 보여줍니다.'
  },
  '외오곰': {
    title: '외오곰 (외우곰)',
    meaning: '외따로이, 홀로 외롭게',
    symbol: '님 없는 적막한 세월 속에서도 홀로 지조를 지키겠다는 다짐.',
    exam: '독수공방하는 화자의 고독한 처지를 강조합니다.'
  },
  '녀신ᄃᆞᆯ': {
    title: '녀신ᄃᆞᆯ (살아간들)',
    meaning: '살아간들 / 지내간들 (녀다 = 살아가다, 가다)',
    symbol: '고전 시가 필수 어휘 ‘녀다/녜다(살아가다)’가 쓰인 대표적 구절.',
    exam: '‘녀다’는 현대 국어의 ‘살아가다’의 옛말로 시험에 매우 자주 출제됩니다.'
  },
  '신': {
    title: '신(信)잇ᄃᆞᆫ (믿음이야)',
    meaning: '님을 향한 신의, 믿음이야.',
    symbol: '2연의 핵심 주제어이자 끈이 상징하는 내면적 가치.',
    exam: '형상화된 사물인 ‘끈’과 관념적 가치인 ‘신(信)’의 의미적 대응 관계를 묻는 문제가 빈출됩니다.'
  },
  '대동강': {
    title: '대동강 (大同江)',
    meaning: '평양을 가로지르는 넓은 강.',
    symbol: '화자와 님 사이를 가로막아 사랑을 끝내 단절시키는 ‘이별과 단절의 공간’.',
    exam: '한국 문학 전통에서 강(물)이 지니는 ‘단절과 영원한 이별’의 원형적 심상을 보여줍니다.'
  },
  '너븐디': {
    title: '너븐디 몰라셔 (넓은 줄 몰라서)',
    meaning: '강폭이 얼마나 넓은 줄도 모르고',
    symbol: '사공의 무지와 무책임함을 탓하는 핑계.',
    exam: '떠나는 님 대신 사공을 비난하기 위한 억지스러운 트집이자 원망의 전가입니다.'
  },
  '배내여': {
    title: '배 내여 (배를 띄워)',
    meaning: '배를 나루터에 대어 놓았느냐',
    symbol: '이별을 현실로 만드는 매개체인 ‘배’에 대한 불만.',
    exam: '님이 떠날 수 있는 수단을 마련해 준 사공을 향한 직접적 원망.'
  },
  '노ᄒᆞᆫ다': {
    title: '노ᄒᆞᆫ다 (놓았느냐)',
    meaning: '띄워 놓았느냐 (-ㄴ다: 2인칭 의문형 어미)',
    symbol: '사공을 향해 따져 묻는 격앙된 말투.',
    exam: '중세 국어에서 2인칭 주어(사공)에 쓰이는 의문형 종결어미 ‘-ㄴ다’의 용례입니다.'
  },
  '샤공': {
    title: '샤공아 (사공아)',
    meaning: '배를 젓는 사공아.',
    symbol: '차마 떠나는 님을 직접 원망하지 못하고 화풀이하는 ‘원망의 전가(희생양)’ 대상.',
    exam: '사공에 대한 비난은 사실 님을 보내고 싶지 않은 화자의 절박한 심정이 뒤틀려 표출된 것입니다.'
  },
  '네가시': {
    title: '네 가시 (네 아내)',
    meaning: '네 아내가 (가시 = 처, 아내의 옛말)',
    symbol: '사공의 가정사를 들먹이며 쏘아붙이는 거친 감정.',
    exam: '고려가요 특유의 서민적이고 솔직담백하며 거침없는 여성 화자의 어조를 보여줍니다.'
  },
  '엄난': {
    title: '엄난 ᄒᆞᆫ 쥴 (음란한 짓을 하는 줄)',
    meaning: '남편 몰래 바람을 피우는 줄도 모르고',
    symbol: '사공의 가장 아픈 곳을 찔러 배를 띄우지 못하게 하려는 격한 투정.',
    exam: '자신의 남자를 빼앗기지 않으려는 절박함에서 비롯된 극단적인 분노의 전가 표현입니다.'
  },
  '녈ᄇᆡ': {
    title: '녈 ᄇᆡ예 (떠나는 배에)',
    meaning: '움직여 떠나가는 배에 (녈 = 가다, 떠나다)',
    symbol: '돌이킬 수 없는 이별의 순간.',
    exam: '‘녈’은 ‘가다’의 뜻인 ‘녀다’의 관형사형입니다.'
  },
  '언전다': {
    title: '언전다 (얹었느냐 / 태웠느냐)',
    meaning: '내 님을 배에 태웠느냐 (-ㄴ다: 2인칭 의문형 어미)',
    symbol: '사공을 향한 추궁과 탄식.',
    exam: '님을 태운 사공의 행동을 책망하는 구절입니다.'
  },
  '건너편': {
    title: '건너편 (대동강 건너편)',
    meaning: '님이 도달하게 될 낯선 공간.',
    symbol: '화자의 손길이 닿지 않고, 다른 유혹이 기다리고 있을 미지의 위험한 세계.',
    exam: '화자의 불안감과 질투심이 투영된 공간입니다.'
  },
  '고즐': {
    title: '고즐 (꽃을)',
    meaning: '꽃을 (곶 = 꽃의 옛말)',
    symbol: '대동강 건너편에 있는 ‘새로운 여인’을 은유적으로 비유한 시어.',
    exam: '‘꽃을 꺾는다’는 것은 님이 다른 여인을 사귀거나 품에 안을 것을 의미하는 결정적 은유입니다.'
  },
  'ᄇᆡ타들면': {
    title: 'ᄇᆡ 타 들면 (배를 타고 건너가면)',
    meaning: '강을 건너가 발을 디디면',
    symbol: '이별이 완성되는 두려운 순간.',
    exam: '님이 강을 건너는 즉시 마음이 변할까 봐 염려하는 화자의 불안입니다.'
  },
  '것고리이다': {
    title: '것고리이다 (꺾을 것입니다)',
    meaning: '다른 여인을 사귈 것입니다 (꺾다 = 여인을 취하다)',
    symbol: '떠나는 님의 정조에 대한 의구심과 불신, 인간적인 질투심의 절정.',
    exam: '미화되거나 순화되지 않은, 사랑 앞에 솔직하고 질투 어린 고려 여인의 생생한 목소리입니다.'
  }
};

// ==========================================================
// 2. 50문항 문제은행 풀 (Question Bank)
// ==========================================================
const QUESTION_BANK = [
  // [객관식 1~35]
  {
    id: 1,
    type: 'choice',
    question: '<서경별곡>의 갈래적 특징에 대한 설명으로 가장 적절한 것은?',
    options: [
      '조선 시대 양반 사대부들이 주로 향유한 정형시이다.',
      '3음보의 율격과 후렴구, 분연체(분장체) 구조를 가진 고려가요이다.',
      '향찰로 기록되어 신라의 향가 전통을 그대로 계승하였다.',
      '후렴구가 작품의 애절하고 슬픈 정서와 완벽하게 일치한다.'
    ],
    answer: 2,
    explanation: '<서경별곡>은 고려 시대 민중들이 부르던 고려가요(고려속요)로, 3음보 율격, 분연체, 후렴구를 갖추고 있습니다. 조선 성종 때 악학궤범 등에 한글로 정착되었습니다.'
  },
  {
    id: 2,
    type: 'choice',
    question: '제1연에서 화자가 ‘질삼 베’를 버리고 님을 따르겠다고 한 행위가 의미하는 바로 가장 적절한 것은?',
    options: [
      '직조 기술을 연마하기 위해 다른 지역으로 유학을 떠남',
      '자신의 생업과 사회적 기반을 포기할 만큼 님을 향한 적극적 사랑',
      '부모님의 반대를 무릅쓰고 가출을 감행하려는 반항심',
      '더 많은 재물을 얻기 위해 상업에 종사하겠다는 의지'
    ],
    answer: 2,
    explanation: '‘질삼 베’는 여성 화자의 생계를 지탱하는 중요한 생업 수단입니다. 이를 버린다는 것은 생계마저 포기하고 사랑을 선택하겠다는 화자의 적극적이고 저돌적인 사랑의 태도를 보여줍니다.'
  },
  {
    id: 3,
    type: 'choice',
    question: '제2연의 ‘구슬’과 ‘바위’의 관계에 대한 설명으로 옳은 것은?',
    options: [
      '구슬은 훼손되지 않는 영원함, 바위는 연약한 마음을 상징한다.',
      '구슬은 사랑과 믿음, 바위는 사랑을 위협하는 시련과 역경을 상징한다.',
      '구슬은 떠나는 님을, 바위는 기다리는 화자 자신을 상징한다.',
      '구슬과 바위는 모두 화자의 굳은 절개와 고결한 인품을 비유한다.'
    ],
    answer: 2,
    explanation: '구슬은 화자와 님의 소중한 사랑(결합)을 비유하며, 바위는 구슬을 깨뜨릴 수 있는 가혹한 운명적 시련과 역경을 의미합니다.'
  },
  {
    id: 4,
    type: 'choice',
    question: '제2연에서 ‘끈이딴 그츠리잇가’에 사용된 주된 표현 방식은?',
    options: [
      '설의법을 통해 님을 향한 믿음(신의)이 결코 끊어지지 않음을 강조한다.',
      '역설법을 통해 모순된 진리를 드러내고 있다.',
      '의인법을 사용하여 자연물에 인격을 부여하고 있다.',
      '풍유법을 통해 사회의 부조리함을 우회적으로 비판한다.'
    ],
    answer: 1,
    explanation: '‘그츠리잇가(끊어지겠습니까)’는 뻔한 사실을 의문형으로 표현하여 ‘결코 끊어지지 않는다’는 확신을 역설하는 설의법입니다.'
  },
  {
    id: 5,
    type: 'choice',
    question: '제2연(구슬가)의 내용이 다른 고려가요 <정석가(鄭石歌)>의 6연에도 똑같이 등장하는 이유로 가장 타당한 것은?',
    options: [
      '두 작품의 작가가 동일 인물이기 때문이다.',
      '당시 고려 백성들 사이에서 널리 불리던 유행 가사(구전자승)가 삽입되었기 때문이다.',
      '조선 시대에 한글로 정착되면서 필사자가 실수로 베껴 썼기 때문이다.',
      '궁중 악관들이 왕의 명령에 의해 강제로 복제하여 삽입했기 때문이다.'
    ],
    answer: 2,
    explanation: '<서경별곡> 2연과 <정석가> 6연의 일치는 고려가요가 문자로 고정되기 전 구전되던 민간 가요였으며, 당시 유행하던 구절이 여러 노래에 자연스럽게 삽입되어 향유되었음을 증명합니다.'
  },
  {
    id: 6,
    type: 'choice',
    question: '제3연에서 ‘대동강’이 지니는 문학적 상징성으로 가장 적절한 것은?',
    options: [
      '화자와 님이 재회를 약속하는 희망의 공간',
      '화자와 님을 영원히 갈라놓는 이별과 단절의 공간',
      '속세를 떠나 자연과 동화되는 탈속의 공간',
      '조국과 고향을 지키기 위한 역사적 결전의 장소'
    ],
    answer: 2,
    explanation: '‘대동강’은 배를 타고 건너가면 다시 돌아오기 힘든 경계로, 화자와 님 사이의 관계를 물리적·심리적으로 단절시키는 이별의 공간입니다.'
  },
  {
    id: 7,
    type: 'choice',
    question: '제3연에서 화자가 죄 없는 ‘사공’에게 험한 말을 쏟아붓는 심리적 이유로 옳은 것은?',
    options: [
      '사공이 뱃삯을 터무니없이 비싸게 요구했기 때문에',
      '떠나는 님에 대한 원망과 슬픔을 사공에게 돌리는 ‘원망의 전가’ 현상 때문에',
      '사공이 평소 마을 사람들에게 온갖 패악을 부렸기 때문에',
      '사공이 과거에 화자의 청혼을 거절한 원한이 남아 있어서'
    ],
    answer: 2,
    explanation: '화자는 떠나는 님을 차마 직접 원망하지 못하고, 배를 내어 님을 태우는 사공에게 분노와 원망의 화살을 돌리는 ‘원망의 전가(투사)’ 심리를 드러냅니다.'
  },
  {
    id: 8,
    type: 'choice',
    question: '제3연의 ‘고즐 것고리이다(꽃을 꺾을 것입니다)’에서 ‘꽃’이 비유하는 바는?',
    options: [
      '대동강 변에 핀 아름다운 수로부인의 꽃',
      '강 건너편에서 님이 새롭게 만나게 될 다른 여인',
      '화자 자신이 간직하고 있는 고결한 순결',
      '봄철 대동강 나루터의 수려한 자연경관'
    ],
    answer: 2,
    explanation: '‘꽃을 꺾는다’는 것은 남성이 여인을 취한다는 성적·애정적 은유로, 님이 강을 건너가면 다른 여인에게 마음을 빼앗길 것이라는 질투와 의구심을 표현합니다.'
  },
  {
    id: 9,
    type: 'choice',
    question: '<서경별곡>의 여성 화자와 <가시리>의 여성 화자를 비교한 내용으로 알맞지 않은 것은?',
    options: [
      '<서경별곡> 화자는 생업을 버리고라도 님을 좇아가겠다는 능동적 태도를 취한다.',
      '<가시리> 화자는 님이 서운하면 다시 오지 않을까 염려하여 고이 보내준다.',
      '두 화자 모두 떠나는 님에 대해 격한 저주와 의심을 여과 없이 쏟아낸다.',
      '<서경별곡>은 직설적·도발적 감정 표출, <가시리>는 애이불비의 절제된 슬픔이 두드러진다.'
    ],
    answer: 3,
    explanation: '<가시리>의 화자는 순종적이고 감정을 절제하며 재회를 기원할 뿐, 결코 님에게 저주나 의심을 쏟아붓지 않습니다. 저돌적인 분노와 의심은 <서경별곡> 화자의 특징입니다.'
  },
  {
    id: 10,
    type: 'choice',
    question: '후렴구 ‘위 두어렁셩 두어렁셩 다링디리’에 대한 설명으로 옳지 않은 것은?',
    options: [
      '북과 장구 등 타악기 소리를 흉내 낸 의성어로 흥겨운 느낌을 준다.',
      '작품 전체의 슬프고 비극적인 노랫말의 분위기와 잘 어우러진다.',
      '각 구절 사이에 삽입되어 음악적 리듬감과 연을 구분하는 기능을 한다.',
      '민간 가요가 궁중 연희 음악으로 수용되는 과정에서 덧붙여졌을 가능성이 높다.'
    ],
    answer: 2,
    explanation: '후렴구는 경쾌한 타악기 의성어이므로, 슬픈 이별의 노랫말과는 정서적 괴리(불일치)를 보입니다. 이는 궁중 연악으로 편입되며 흥을 돋우기 위해 첨가된 특징입니다.'
  },
  {
    id: 11,
    type: 'choice',
    question: '<서경별곡>에 쓰인 주요 율격으로 가장 알맞은 것은?',
    options: [
      '4음보 율격 (4·4조)',
      '3음보 율격 (3·3·3조 또는 3·3·2조)',
      '7·5조 2음보 율격',
      '자유로운 내재율의 산문 율격'
    ],
    answer: 2,
    explanation: '고려가요의 전형적인 율격은 3음보(3·3·3조 또는 3·3·2조)입니다. "서경이 / 아질가 / 서경이 / 서울히마르는"처럼 3음보를 기저로 합니다.'
  },
  {
    id: 12,
    type: 'choice',
    question: '‘서경이 아질가 서경이 서울히 마르는’에서 ‘아질가’의 기능으로 알맞은 것은?',
    options: [
      '특별한 의미 없이 음수를 맞추고 흥취를 돋우는 감탄사적 여음구',
      '이별의 구체적인 날짜와 시간을 지시하는 시간 부사어',
      '화자의 고향 평양의 옛 방언으로 된 지명',
      '사공의 이름을 부르는 호칭어'
    ],
    answer: 1,
    explanation: '‘아질가’는 특별한 의미를 지니지 않고, 3음보의 음악적 운율을 맞추고 흥을 돋우기 위해 반복 삽입된 감탄사적 여음(조흥구)입니다.'
  },
  {
    id: 13,
    type: 'choice',
    question: '제1연의 ‘괴시란ᄃᆡ’에서 ‘괴다’의 현대어 뜻은?',
    options: ['괴롭히다', '사랑하다', '의심하다', '헤어지다'],
    answer: 2,
    explanation: '고어 ‘괴다’는 ‘사랑하다’를 뜻하며, ‘괴시란ᄃᆡ’는 ‘나를 사랑해만 주신다면’으로 해석됩니다.'
  },
  {
    id: 14,
    type: 'choice',
    question: '제2연에서 ‘천 년’을 가리키는 고유어는?',
    options: ['온 ᄒᆡ', '즈믄 ᄒᆡ', '골 ᄒᆡ', '잘 ᄒᆡ'],
    answer: 2,
    explanation: '‘즈믄’은 숫자 ‘1,000(천)’을 뜻하는 순우리말 고어입니다. (참고: 온 = 100, 즈믄 = 1000, 골 = 10000)'
  },
  {
    id: 15,
    type: 'choice',
    question: '제2연의 ‘신(信)잇ᄃᆞᆫ 그츠리잇가’에 나타난 화자의 태도는?',
    options: [
      '님에 대한 굳건한 신뢰와 변함없는 사랑의 확신',
      '자신의 종교적 신앙을 버리지 않겠다는 결의',
      '친구와의 우정이 영원하리라는 우정의 서약',
      '국가에 대한 충성심을 잃지 않겠다는 충신연주지사'
    ],
    answer: 1,
    explanation: '‘신(信)’은 님과 나 사이의 믿음과 약속을 의미하며, 천 년을 홀로 살아도 결코 끊어지지 않는 영원한 신뢰를 다짐하고 있습니다.'
  },
  {
    id: 16,
    type: 'choice',
    question: '제3연의 ‘네 가시 엄난 ᄒᆞᆫ 쥴 몰라셔’에서 ‘가시’의 의미는?',
    options: ['몸에 돋아난 가시', '사공의 아내(처)', '가시나무 덤불', '가식적인 행동'],
    answer: 2,
    explanation: '‘가시’는 ‘아내(처, 妻)’를 뜻하는 중세 국어 어휘입니다.'
  },
  {
    id: 17,
    type: 'choice',
    question: '‘배 내여 노ᄒᆞᆫ다 샤공아’에서 ‘-ㄴ다’의 문법적 기능은?',
    options: [
      '2인칭 주어에 대한 의문형 종결 어미',
      '과거의 사실을 회상하는 어미',
      '강한 명령을 나타내는 종결 어미',
      '존칭을 나타내는 주체 높임 선어말 어미'
    ],
    answer: 1,
    explanation: '중세 국어에서 ‘-ㄴ다’는 2인칭 주어(너, 사공)를 대상으로 질문할 때 사용되는 의문형 종결 어미입니다.'
  },
  {
    id: 18,
    type: 'choice',
    question: '<서경별곡>이 조선 시대에 음탕한 노래라 하여 유학자들에게 비판받았던 명칭은?',
    options: ['군신유의', '남녀상열지사(男女相悅之詞)', '권선징악', '안빈낙도'],
    answer: 2,
    explanation: '조선 성리학자들은 고려가요에 남녀 간의 솔직하고 거침없는 애정 표현이 많다 하여 ‘남녀상열지사’ 또는 ‘음사(淫辭)’라고 부르며 비판했습니다.'
  },
  {
    id: 19,
    type: 'choice',
    question: '제1연과 제3연에 나타난 여성 화자의 성격으로 가장 알맞은 것은?',
    options: [
      '가부장적 질서에 순응하고 인종(忍從)하는 여성',
      '자신의 감정에 솔직하고 주체적이며 적극적인 여성',
      '현실을 도피하고 종교적 초월을 추구하는 여성',
      '체면과 규범을 중시하여 감정을 숨기는 여성'
    ],
    answer: 2,
    explanation: '<서경별곡> 화자는 서경과 생업을 버리고 따라가겠다고 하거나, 사공을 욕하고 질투를 숨기지 않는 등 매우 주체적이고 인간적인 면모를 보여줍니다.'
  },
  {
    id: 20,
    type: 'choice',
    question: '<서경별곡>의 후렴구가 연마다 반복되면서 얻는 효과가 아닌 것은?',
    options: [
      '형태적인 안정감과 구조적 통일성을 부여한다.',
      '흥겨운 음악적 리듬감을 형성한다.',
      '각 연과 구를 시각적·음악적으로 분절해 준다.',
      '작품에 담긴 비극적 이별의 한을 깊이 있게 심화시킨다.'
    ],
    answer: 4,
    explanation: '후렴구의 경쾌한 리듬은 이별의 비극적 정서를 심화하기보다는 오히려 흥취를 돋우어 노랫말의 정서와 대조를 이룹니다.'
  },
  {
    id: 21,
    type: 'choice',
    question: '다음 중 <서경별곡>에서 ‘시련과 고난’을 상징하는 시어로 묶인 것은?',
    options: ['서경, 서울', '구슬, 끈', '바위, 대동강', '질삼 베, 꽃'],
    answer: 3,
    explanation: '‘바위’는 구슬(사랑)을 위협하는 시련이며, ‘대동강’은 님과의 이별과 단절을 초래하는 시련의 공간입니다.'
  },
  {
    id: 22,
    type: 'choice',
    question: '<서경별곡> 제1연에 드러난 화자의 태도와 가장 유사한 시조 구절은?',
    options: [
      '이화우 흩뿌릴 제 울며 잡고 이별한 님 (계랑)',
      '묏버들 가려 꺾어 보내노라 님의 손에 (홍랑)',
      '천만리 머나먼 길에 고운 님 여의옵고 (왕방연)',
      '방 안에 켜 있는 촛불 누구와 이별하였관대 (이개)'
    ],
    answer: 2,
    explanation: '홍랑의 시조는 님에게 묏버들을 꺾어 보내며 자신을 잊지 말아 달라는 적극적인 연모의 정을 보여주어 <서경별곡>의 적극성과 맥을 같이합니다.'
  },
  {
    id: 23,
    type: 'choice',
    question: '제2연에서 ‘구스리 바회예 뎐든’과 ‘즈믄 ᄒᆡᄅᆞᆯ 외오곰 녀신ᄃᆞᆯ’의 관계는?',
    options: [
      '앞 구절은 원인이고 뒤 구절은 그로 인한 결과이다.',
      '앞 구절은 구체적 사물에 빗댄 비유이고, 뒤 구절은 관념적 사실을 서술한 대구이다.',
      '앞 구절과 뒤 구절은 서로 상반된 내용을 서술하여 모순을 이룬다.',
      '앞 구절은 과거의 회상이고 뒤 구절은 미래의 희망이다.'
    ],
    answer: 2,
    explanation: '구슬-바위-끈의 비유적 표현과 즈믄 해-외오곰-신의의 실제적 서술이 완벽한 대구와 유추의 구조를 이룹니다.'
  },
  {
    id: 24,
    type: 'choice',
    question: '<서경별곡>이 수록되어 전하는 악서(樂書)가 아닌 것은?',
    options: ['악학궤범', '악장가사', '시용향악보', '삼국유사'],
    answer: 4,
    explanation: '<삼국유사>에는 신라 향가 14수가 수록되어 있습니다. 고려가요는 조선 초기의 <악학궤범>, <악장가사>, <시용향악보> 등에 한글로 기록되었습니다.'
  },
  {
    id: 25,
    type: 'choice',
    question: '제3연에서 화자의 질투심이 가장 잘 드러난 행동은?',
    options: [
      '사공의 멱살을 잡고 배를 침몰시키려 했다.',
      '님이 강을 건너면 다른 여인(꽃)을 꺾을 것이라고 의심했다.',
      '대동강 나루터의 모든 배를 불태워 버렸다.',
      '길쌈하던 베를 찢어 강물에 던져 버렸다.'
    ],
    answer: 2,
    explanation: '“배 타 들면 고즐 것고리이다”를 통해 님이 대동강을 건너가면 다른 여인을 만나 사랑을 나눌 것이라며 강한 질투를 드러냅니다.'
  },
  {
    id: 26,
    type: 'choice',
    question: '<서경별곡>의 시상 전개 과정으로 가장 적절한 것은?',
    options: [
      '체념과 수용 ➔ 자연과의 합일 ➔ 재회의 기약',
      '이별의 거부 ➔ 사랑과 믿음의 맹세 ➔ 사공 원망과 질투',
      '임금에 대한 충성 ➔ 유배지의 비애 ➔ 고향에 대한 그리움',
      '전쟁의 참상 고발 ➔ 평화의 염원 ➔ 승전의 환호'
    ],
    answer: 2,
    explanation: '1연(이별 거부 및 동행 의지) ➔ 2연(변함없는 신의 다짐) ➔ 3연(사공 원망 및 다른 여인에 대한 질투)으로 감정이 극적으로 전개됩니다.'
  },
  {
    id: 27,
    type: 'choice',
    question: '‘우러곰 좃ᄂᆞ니이다’에서 ‘-곰’의 품사적 성격과 기능은?',
    options: [
      '문장을 끝맺는 종결 어미',
      '동작의 반복과 강조를 나타내는 강세 접미사',
      '체언 뒤에 붙어 주어를 만드는 주격 조사',
      '부정의 의미를 덧붙이는 부정 부사'
    ],
    answer: 2,
    explanation: '‘-곰’은 중세 국어에서 용언의 어간이나 부사 뒤에 붙어 뜻을 강조하거나 반복을 나타내는 강세 접미사입니다.'
  },
  {
    id: 28,
    type: 'choice',
    question: '<서경별곡>의 공간적 배경인 ‘서경’에 대한 당대 고려인들의 인식은?',
    options: [
      '외적의 침략으로 황폐화된 버려진 변방',
      '고구려의 기상을 계승한 제2의 수도이자 자부심 넘치는 번화한 도시',
      '유배된 죄인들이 갇혀 지내던 척박한 섬',
      '불교 탄압으로 인해 승려들이 숨어 살던 은둔지'
    ],
    answer: 2,
    explanation: '고려는 북진 정책을 추진하며 평양을 ‘서경’으로 승격시키고 매우 중시하였으므로, 화자에게도 큰 자부심과 애착이 담긴 공간입니다.'
  },
  {
    id: 29,
    type: 'choice',
    question: '다음 중 김소월의 현대시 <진달래꽃>과 <서경별곡> 화자의 공통점은?',
    options: [
      '이별의 슬픔과 한(恨)을 여성 화자의 목소리로 노래하였다.',
      '떠나는 님을 향해 저주와 원망을 거침없이 표출하였다.',
      '모든 생업을 버리고 님의 뒤를 끝까지 쫓아갔다.',
      '사공을 탓하며 이별의 책임을 타인에게 전가하였다.'
    ],
    answer: 1,
    explanation: '두 작품 모두 전통적인 ‘이별의 정한’을 지닌 여성 화자가 등장한다는 공통점이 있습니다. (단, 대처 태도는 서경별곡이 훨씬 능동적입니다.)'
  },
  {
    id: 30,
    type: 'choice',
    question: '<서경별곡>에서 사용된 표현 기법으로 볼 수 없는 것은?',
    options: [
      '구슬과 끈을 활용한 비유법',
      '‘그츠리잇가’를 통한 설의법',
      '‘즈믄 ᄒᆡ’라는 장구한 세월을 제시한 과장법',
      '모든 것을 포기하고 침묵 속에 관조하는 달관법'
    ],
    answer: 4,
    explanation: '<서경별곡>은 침묵 속에 달관하거나 체념하지 않고, 적극적으로 감정을 토해내는 격정적인 작품입니다.'
  },
  {
    id: 31,
    type: 'choice',
    question: '제3연의 ‘녈 ᄇᆡ예 언전다 샤공아’에서 느껴지는 화자의 어조는?',
    options: ['격앙되고 원망 섞인 어조', '차분하고 관조적인 어조', '희망차고 낙관적인 어조', '공손하고 순종적인 어조'],
    answer: 1,
    explanation: '사공을 향해 네 아내 바람난 줄도 모르고 배에 님을 태웠냐고 쏘아붙이는 격앙되고 거친 원망의 어조입니다.'
  },
  {
    id: 32,
    type: 'choice',
    question: '고려가요의 형식적 특징 중 <서경별곡>에 해당하는 것으로 알맞게 짝지어진 것은?',
    options: [
      '단연체 - 무후렴 - 4음보',
      '분연체 - 후렴구 - 3음보',
      '기승전결 4단 구성 - 후렴구',
      '초장·중장·종장의 3장 6구'
    ],
    answer: 2,
    explanation: '고려가요의 3대 형식적 특징은 분연체(여러 연으로 나뉨), 후렴구(조흥구), 3음보 연속체입니다.'
  },
  {
    id: 33,
    type: 'choice',
    question: '제1연의 ‘여ᄒᆡ므론’의 현대어 뜻으로 올바른 것은?',
    options: ['여행하므로', '이별하기보다는', '여유가 있으므로', '결혼하기보다는'],
    answer: 2,
    explanation: '‘여ᄒᆡ다’는 ‘이별하다, 헤어지다’의 옛말로, ‘이별하기보다는 차라리 길쌈 베를 버리고 따르겠다’는 뜻입니다.'
  },
  {
    id: 34,
    type: 'choice',
    question: '제2연에서 ‘끈’이 원관념으로 지칭하는 것은 무엇인가?',
    options: ['재물', '믿음(신의)', '질삼 베', '권력'],
    answer: 2,
    explanation: '구슬을 꿰고 있는 ‘끈’은 님과 나 사이의 보이지 않는 단단한 ‘믿음(신, 信)’을 뜻합니다.'
  },
  {
    id: 35,
    type: 'choice',
    question: '<서경별곡>을 교실에서 감상한 학생들의 반응으로 적절하지 않은 것은?',
    options: [
      '민우: 전통적 여인상이라고 해서 다 얌전하고 순종적이지만은 않았다는 걸 알게 됐어.',
      '수아: 사랑을 지키기 위해 생계까지 버리겠다는 용기가 정말 대단하고 인상적이야.',
      '지호: 사공에게 화풀이하는 모습을 보니 화자가 님을 잃을까 봐 얼마나 불안했는지 공감돼.',
      '현우: 화자는 결국 현실을 순순히 인정하고 님이 돌아오기만을 방 안에서 조용히 기다렸겠네.'
    ],
    answer: 4,
    explanation: '<서경별곡>의 화자는 방 안에서 조용히 기다리는 인물이 아니라, 울면서라도 님을 쫓아가겠다고 외치는 능동적 인물입니다.'
  },

  // [O/X 퀴즈 36~45]
  {
    id: 36,
    type: 'ox',
    question: '<서경별곡>의 화자는 님과의 이별을 담담하게 받아들이고 조용히 순종한다.',
    options: ['O', 'X'],
    answer: 'X',
    explanation: '<서경별곡>의 화자는 이별을 강하게 거부하며 생업을 버리고라도 님을 따르겠다고 적극적으로 나섭니다.'
  },
  {
    id: 37,
    type: 'ox',
    question: '‘질삼 베’는 여성 화자의 생활 수단이자 경제적 기반을 상징하는 시어이다.',
    options: ['O', 'X'],
    answer: 'O',
    explanation: '길쌈하던 베는 전통 사회 여성의 주요한 생업 밑천으로, 이를 버린다는 것은 지극한 사랑을 의미합니다.'
  },
  {
    id: 38,
    type: 'ox',
    question: '<서경별곡> 제2연의 구슬가 구절은 또 다른 고려가요인 <정석가> 6연에도 동일하게 실려 있다.',
    options: ['O', 'X'],
    answer: 'O',
    explanation: '두 작품에 동일한 구절이 수록되어 있어 당대 널리 불리던 유행 가사였음을 알 수 있습니다.'
  },
  {
    id: 39,
    type: 'ox',
    question: '제2연에서 ‘바위’는 두 사람의 사랑이 영원히 결합됨을 상징하는 긍정적 시어이다.',
    options: ['O', 'X'],
    answer: 'X',
    explanation: '‘바위’는 구슬(사랑)을 부딪혀 깨뜨리는 시련과 고난, 역경을 상징하는 부정적 시어입니다.'
  },
  {
    id: 40,
    type: 'ox',
    question: '후렴구 ‘위 두어렁셩 두어렁셩 다링디리’는 타악기 소리를 흉내 낸 의성어로 경쾌한 느낌을 준다.',
    options: ['O', 'X'],
    answer: 'O',
    explanation: '북이나 장구의 울림소리를 흉내 낸 조흥구로, 경쾌하고 흥겨운 리듬을 형성합니다.'
  },
  {
    id: 41,
    type: 'ox',
    question: '제3연의 ‘대동강’은 화자와 님의 사랑을 이어주는 화합과 소통의 매개체이다.',
    options: ['O', 'X'],
    answer: 'X',
    explanation: '대동강은 건너가면 다시 만나기 어려운 이별과 단절의 공간입니다.'
  },
  {
    id: 42,
    type: 'ox',
    question: '화자가 사공의 아내를 들먹이며 비난하는 것은 떠나는 님에 대한 원망을 엉뚱한 곳에 전가하는 행위이다.',
    options: ['O', 'X'],
    answer: 'O',
    explanation: '차마 님을 직접 원망하지 못하고 무고한 사공에게 분노와 핑계를 돌리는 원망의 전가(투사)입니다.'
  },
  {
    id: 43,
    type: 'ox',
    question: '‘고즐 것고리이다’에서 ‘꽃’은 화자 자신만을 바라보는 님의 한결같은 순정을 비유한다.',
    options: ['O', 'X'],
    answer: 'X',
    explanation: '‘꽃’은 대동강 건너편의 ‘새로운 여인’을 비유하며, 화자의 불안과 질투를 유발하는 대상입니다.'
  },
  {
    id: 44,
    type: 'ox',
    question: '<가시리>의 화자와 <서경별곡>의 화자는 모두 자신의 감정을 직설적으로 터뜨리는 공통점이 있다.',
    options: ['O', 'X'],
    answer: 'X',
    explanation: '<가시리>는 감정을 절제(애이불비)하고 순종하지만, <서경별곡>은 직설적이고 거침없이 감정을 표출합니다.'
  },
  {
    id: 45,
    type: 'ox',
    question: '<서경별곡>은 구전되다가 조선 시대 훈민정음 창제 이후 문헌에 한글로 기록되어 정착되었다.',
    options: ['O', 'X'],
    answer: 'O',
    explanation: '고려 시대에 민간에서 구전되다 조선 성종 때 <악학궤범>, <악장가사> 등에 한글로 수록되었습니다.'
  },

  // [단답형 주관식 46~50]
  {
    id: 46,
    type: 'short',
    question: '제1연에서 여성 화자가 님을 따르기 위해 기꺼이 버리겠다고 선언한 자신의 생업 수단(세 글자)을 쓰시오.',
    answer: ['질삼베', '질삼 베', '길쌈베', '길쌈 베'],
    explanation: '‘질삼 베(길쌈 베)’는 여성 화자의 생계를 상징하며, 이를 버리는 것은 사랑을 위한 극진한 헌신을 뜻합니다.'
  },
  {
    id: 47,
    type: 'short',
    question: '제2연에서 시련을 뜻하는 ‘바위’에 떨어져 깨지더라도 결코 끊어지지 않는다고 한 ‘믿음(신의)’을 비유한 시어(한 글자)를 쓰시오.',
    answer: ['끈'],
    explanation: '구슬은 바위에 깨져도 ‘끈(믿음과 사랑의 인연)’은 끊어지지 않는다고 노래했습니다.'
  },
  {
    id: 48,
    type: 'short',
    question: '제3연에서 님과의 영원한 이별과 단절을 초래하는 공간으로 등장하는 강(江)의 이름을 쓰시오.',
    answer: ['대동강'],
    explanation: '평양을 흐르는 ‘대동강’은 님과의 물리적·심리적 단절을 고착화하는 이별의 공간입니다.'
  },
  {
    id: 49,
    type: 'short',
    question: '제3연에서 화자가 차마 님을 직접 탓하지 못하고 원망의 화살을 돌리는 대상(직업)을 쓰시오.',
    answer: ['사공', '샤공'],
    explanation: '배를 띄워 님을 태우는 ‘사공’에게 억지스러운 트집을 잡으며 원망을 전가하고 있습니다.'
  },
  {
    id: 50,
    type: 'short',
    question: '제3연의 “고즐 것고리이다”에서 님이 강 건너편에서 꺾을까 봐 두려워하는 ‘꽃’이 비유하는 원관념을 쓰시오. (예: 새로운 여인)',
    answer: ['새로운 여인', '다른 여인', '새 여인', '여인', '다른 여자', '새로운 여자'],
    explanation: '‘꽃을 꺾는다’는 것은 님이 강 건너편의 ‘다른(새로운) 여인’을 취하여 사귈 것을 두려워하는 질투심을 비유합니다.'
  }
];

// 현재 출제된 10문항 데이터 및 사용자 답안 상태
let currentQuizSet = [];
let userAnswers = {};

// ==========================================================
// 3. 쪽지시험 랜덤 10문항 추출 및 렌더링 엔진 (객관식7 -> O/X 2 -> 단답 1 순서)
// ==========================================================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function initRandomQuiz() {
  // 문제 유형별 분리 추출 (객관식 7문항, O/X 2문항, 단답형 1문항)
  const choicePool = QUESTION_BANK.filter(q => q.type === 'choice');
  const oxPool = QUESTION_BANK.filter(q => q.type === 'ox');
  const shortPool = QUESTION_BANK.filter(q => q.type === 'short');

  shuffleArray(choicePool);
  shuffleArray(oxPool);
  shuffleArray(shortPool);

  // 지정된 순서대로 정확히 배치: 객관식 7 -> OX 2 -> 단답 1
  currentQuizSet = [
    ...choicePool.slice(0, 7),
    ...oxPool.slice(0, 2),
    ...shortPool.slice(0, 1)
  ];
  userAnswers = {};

  // 결과 창 숨김 & 렌더링
  const resultCard = document.getElementById('quiz-result-card');
  if (resultCard) {
    resultCard.classList.add('hidden');
    resultCard.style.display = 'none';
  }

  renderQuizItems();
  updateQuizProgress();

  // 상단 스크롤
  const quizHero = document.querySelector('.quiz-hero');
  if (quizHero) quizHero.scrollIntoView({ behavior: 'smooth' });
}

function renderQuizItems() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  container.innerHTML = '';

  currentQuizSet.forEach((q, idx) => {
    const qNum = idx + 1;
    const card = document.createElement('div');
    card.className = 'quiz-item-card';
    card.id = `quiz-card-${q.id}`;

    let typeText = '4지선다 객관식';
    if (q.type === 'ox') typeText = 'O / X 퀴즈';
    else if (q.type === 'short') typeText = '단답형 주관식';

    let inputHtml = '';

    if (q.type === 'choice') {
      inputHtml = `<div class="q-options-list">`;
      q.options.forEach((opt, optIdx) => {
        const optNum = optIdx + 1;
        inputHtml += `
          <label class="q-option-label" onclick="selectChoiceOption(${q.id}, ${optNum})">
            <input type="radio" name="q_${q.id}" value="${optNum}">
            <span><strong>${optNum}.</strong> ${escapeHtml(opt)}</span>
          </label>
        `;
      });
      inputHtml += `</div>`;
    } else if (q.type === 'ox') {
      inputHtml = `
        <div class="ox-btn-grid">
          <button type="button" class="ox-choice-btn" id="ox-btn-${q.id}-O" onclick="selectOxOption(${q.id}, 'O')">⭕ 그렇다 (O)</button>
          <button type="button" class="ox-choice-btn" id="ox-btn-${q.id}-X" onclick="selectOxOption(${q.id}, 'X')">❌ 아니다 (X)</button>
        </div>
      `;
    } else if (q.type === 'short') {
      inputHtml = `
        <div class="short-input-box">
          <input type="text" class="short-answer-input" id="short-input-${q.id}" placeholder="정답을 입력하세요 (예: 질삼베)" oninput="handleShortInput(${q.id}, this.value)">
        </div>
      `;
    }

    card.innerHTML = `
      <div class="quiz-item-header">
        <span class="q-num-badge">문제 ${qNum}</span>
        <span class="q-type-badge">${typeText}</span>
        <span id="badge-status-${q.id}" class="answer-status-badge hidden"></span>
      </div>
      <p class="q-question-text">${escapeHtml(q.question)}</p>
      ${inputHtml}
      <div id="exp-box-${q.id}" class="explanation-box hidden">
        <span class="exp-label">💡 정답 및 교사 핵심 해설:</span>
        <p>${q.explanation}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// 답안 선택 핸들러들
function selectChoiceOption(qId, optNum) {
  userAnswers[qId] = optNum;
  const card = document.getElementById(`quiz-card-${qId}`);
  if (card) {
    const labels = card.querySelectorAll('.q-option-label');
    labels.forEach((lbl, idx) => {
      if (idx + 1 === optNum) {
        lbl.classList.add('selected');
        const radio = lbl.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      } else {
        lbl.classList.remove('selected');
      }
    });
  }
  updateQuizProgress();
}

function selectOxOption(qId, val) {
  userAnswers[qId] = val;
  const btnO = document.getElementById(`ox-btn-${qId}-O`);
  const btnX = document.getElementById(`ox-btn-${qId}-X`);
  if (val === 'O') {
    if (btnO) btnO.classList.add('selected');
    if (btnX) btnX.classList.remove('selected');
  } else {
    if (btnX) btnX.classList.add('selected');
    if (btnO) btnO.classList.remove('selected');
  }
  updateQuizProgress();
}

function handleShortInput(qId, val) {
  const trimmed = val.trim();
  if (trimmed.length > 0) {
    userAnswers[qId] = trimmed;
  } else {
    delete userAnswers[qId];
  }
  updateQuizProgress();
}

function updateQuizProgress() {
  const answeredCount = Object.keys(userAnswers).length;
  const progressText = document.getElementById('quiz-progress-text');
  const progressBar = document.getElementById('quiz-progress-bar');

  if (progressText) progressText.innerText = `${answeredCount} / 10`;
  if (progressBar) progressBar.style.width = `${(answeredCount / 10) * 100}%`;
}

// 일괄 채점
function gradeQuiz() {
  if (Object.keys(userAnswers).length < currentQuizSet.length) {
    const remain = currentQuizSet.length - Object.keys(userAnswers).length;
    if (!confirm(`아직 풀지 않은 문제가 ${remain}개 있습니다. 이대로 제출하고 채점하시겠습니까?`)) {
      return;
    }
  }

  let correctCount = 0;

  currentQuizSet.forEach((q) => {
    const userAns = userAnswers[q.id];
    let isCorrect = false;

    if (q.type === 'choice') {
      isCorrect = Number(userAns) === q.answer;
    } else if (q.type === 'ox') {
      isCorrect = userAns === q.answer;
    } else if (q.type === 'short') {
      if (userAns) {
        const cleanUser = userAns.replace(/\s+/g, '').toLowerCase();
        isCorrect = q.answer.some(ans => ans.replace(/\s+/g, '').toLowerCase() === cleanUser);
      }
    }

    if (isCorrect) correctCount++;

    // 시각적 피드백 적용
    const card = document.getElementById(`quiz-card-${q.id}`);
    const badge = document.getElementById(`badge-status-${q.id}`);
    const expBox = document.getElementById(`exp-box-${q.id}`);

    if (card) {
      card.classList.remove('is-correct', 'is-wrong');
      card.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
    }

    if (badge) {
      badge.classList.remove('hidden', 'status-correct', 'status-wrong');
      badge.classList.add(isCorrect ? 'status-correct' : 'status-wrong');
      badge.innerText = isCorrect ? '정답 ✓' : '오답 ✗';
    }

    if (expBox) {
      expBox.classList.remove('hidden');
    }
  });

  const score = correctCount * 10;
  const resultCard = document.getElementById('quiz-result-card');
  const scoreNum = document.getElementById('result-score');
  const titleElem = document.getElementById('result-title');
  const msgElem = document.getElementById('result-message');
  const correctElem = document.getElementById('count-correct');
  const wrongElem = document.getElementById('count-wrong');

  if (scoreNum) scoreNum.innerText = score;
  if (correctElem) correctElem.innerText = correctCount;
  if (wrongElem) wrongElem.innerText = currentQuizSet.length - correctCount;

  if (titleElem && msgElem) {
    if (score === 100) {
      titleElem.innerText = '🎉 완벽합니다! 서경별곡 1등급 마스터!';
      msgElem.innerText = '고려가요 서경별곡의 원문, 화자의 정서, 표현상 특징, 문학사적 의의까지 완벽히 꿰뚫고 계시네요!';
    } else if (score >= 80) {
      titleElem.innerText = '👏 대단해요! 우수한 성적입니다!';
      msgElem.innerText = '서경별곡의 핵심 내용을 잘 이해하고 있습니다. 틀린 문제의 교사 해설을 점검하면 만점도 거뜬합니다!';
    } else if (score >= 60) {
      titleElem.innerText = '📚 조금만 더 보완하면 완성!';
      msgElem.innerText = '개념정리 탭의 시어 뜻풀이와 가시리 비교 분석표를 한 번 더 복습한 뒤 다시 도전해 보세요!';
    } else {
      titleElem.innerText = '💪 개념정리 탭을 먼저 꼼꼼히 읽어보세요!';
      msgElem.innerText = '원문의 낯선 어휘와 화자의 능동적인 태도를 중심으로 개념정리 카드를 공부한 뒤 다시 응시해 보세요!';
    }
  }

  if (resultCard) {
    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToQuizReview() {
  const container = document.getElementById('quiz-container');
  if (container) container.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================================
// 4. 서경의 여인 DM 인터랙티브 대화 게임 엔진
// ==========================================================
const DM_SCENARIOS = [
  {
    step: 1,
    heroine: "님께서 지금 대동강 나루터에서 배를 기다리고 계십니다... 저는 평양 소성경에서 길쌈하며 평생 님만 바라보고 살아왔는데, 님은 저를 두고 왜 떠나려 하시는 걸까요? 제 가슴이 찢어질 것만 같습니다.",
    choices: [
      {
        text: "“울지 마세요. 님도 피치 못할 사정이 있으실 테니, 곱게 보내드리고 기다려야지요.”",
        empathy: 10,
        reply: "체념하고 보내드리라고요...? 아니요! 저는 <가시리>의 순종적인 여인처럼 가만히 앉아 눈물만 흘리지는 않을 겁니다!"
      },
      {
        text: "“당신의 삶의 터전인 서경과 소중한 생업인 ‘길쌈 베’를 다 버리고라도 님을 따르고 싶은 심정이시군요!”",
        empathy: 20,
        reply: "맞아요! 제 마음을 정확히 알아주시는군요. 님이 저를 사랑해만 주신다면, 길쌈하던 베 따위는 미련 없이 다 버리고 울면서라도 쫓아갈 것입니다!"
      },
      {
        text: "“길쌈 베를 팔아서 더 많은 노잣돈을 마련해 님에게 바치면 어떨까요?”",
        empathy: 5,
        reply: "돈이나 재물이 무슨 소용입니까... 저는 오직 님의 사랑 하나만을 바랄 뿐인 것을요."
      }
    ]
  },
  {
    step: 2,
    heroine: "사람들은 저더러 미련하다고 손가락질합니다. 이별의 시련이라는 거친 바위에 우리의 연약한 사랑의 구슬이 산산조각 나 버릴 거라면서요...",
    choices: [
      {
        text: "“구슬이 바위에 떨어진들, 구슬을 꿰어 맨 ‘끈(믿음)’이야 어찌 끊어지겠습니까!”",
        empathy: 20,
        reply: "아! 그 말씀이 옳습니다! 구슬은 깨어질지언정 님을 향한 저의 믿음(신, 信)은 결코 끊어지지 않습니다!"
      },
      {
        text: "“바위가 너무 단단하니 구슬을 안전한 주머니에 넣어 숨겨두는 게 좋겠어요.”",
        empathy: 10,
        reply: "숨겨둔다고 이별의 아픔이 가려질까요... 제 마음의 끈이 굳건함을 보여주는 것이 중요합니다."
      },
      {
        text: "“남들의 말이 맞을지도 몰라요. 깨진 구슬은 미련 없이 버리고 새 삶을 찾으세요.”",
        empathy: 5,
        reply: "어찌 그리 매정하게 말씀하시나요... 저는 님을 향한 신의를 쉽게 저버릴 수 없습니다."
      }
    ]
  },
  {
    step: 3,
    heroine: "만약... 만약에 님과 헤어져 홀로 천 년(즈믄 해)을 외따로 살아가야 한다 해도, 제 마음의 믿음이 끊어질 수 있을까요?",
    choices: [
      {
        text: "“인간의 수명은 100년도 안 되는데 천 년은 너무 과장된 헛소리예요.”",
        empathy: 5,
        reply: "제 간절함과 영원한 사랑의 맹세를 어찌 그런 계산적인 잣대로만 재단하시나요..."
      },
      {
        text: "“천 년을 외따로 산다 한들, 님을 향한 ‘신(信)’이야 어찌 끊어지겠습니까! (설의법)”",
        empathy: 20,
        reply: "그렇습니다! 천 년의 고독한 세월이 흘러도 제 지조와 정성은 변치 않을 것입니다. 님이 제 진심을 알아주셔야 할 텐데..."
      },
      {
        text: "“천 년 동안 홀로 지내면 너무 외로우니 다른 좋은 인연을 찾아보세요.”",
        empathy: 10,
        reply: "제게 님 외에 다른 인연은 존재하지 않습니다. 제 사랑은 오직 한 사람뿐입니다."
      }
    ]
  },
  {
    step: 4,
    heroine: "그런데 저기 저 얄미운 사공 놈을 좀 보세요! 대동강이 얼마나 넓은 줄도 모르고 배를 띄워놓았지 뭡니까! 자기 아내가 딴 사내와 바람난 줄도 모르고 남의 님을 태우다니, 저 사공 놈이 괘씸해 죽겠습니다!",
    choices: [
      {
        text: "“사공은 그저 손님을 태우는 직업일 뿐인데, 사공 탓을 하는 건 너무 억지예요.”",
        empathy: 10,
        reply: "저도 머리로는 압니다... 하지만 떠나는 님을 차마 미워할 수 없으니, 사공에게라도 화를 내지 않고는 견딜 수가 없는걸요!"
      },
      {
        text: "“차마 님을 원망하지 못하고 사공에게 원망을 돌릴 만큼, 이별을 막고 싶은 마음이 절박하신 거군요!”",
        empathy: 20,
        reply: "흑흑... 제 속마음을 그대로 꿰뚫어 보셨군요. 맞습니다. 님을 원망할 수 없어 애꿎은 사공을 욕하며 발을 구르고 있었던 것입니다."
      },
      {
        text: "“사공의 아내를 관아에 고발해서 사공을 감옥에 가두면 배가 못 떠나겠네요!”",
        empathy: 5,
        reply: "그렇게까지 남을 해코지하고 싶은 건 아닙니다... 단지 배가 떠나지 않기만을 바랄 뿐입니다."
      }
    ]
  },
  {
    step: 5,
    heroine: "그리고... 사실은 너무나 두렵고 불안합니다. 님이 저 넓은 대동강을 건너가 버리면... 강 건너편의 다른 고운 여인(꽃)을 만나 꺾어버릴까 봐(사귈까 봐) 밤마다 피눈물이 납니다.",
    choices: [
      {
        text: "“대동강 건너편 꽃(새 여인)을 꺾을까 두려워하는 그 질투와 솔직함이야말로, 당신이 님을 얼마나 열렬히 사랑하는지 보여주는 증거입니다.”",
        empathy: 20,
        reply: "맞아요... 저는 내숭을 떨거나 체면을 차리지 못합니다. 님이 다른 여인을 만날까 봐 질투가 나 미칠 것만 같습니다. 제 사랑은 이토록 솔직하고 절박합니다!"
      },
      {
        text: "“남자는 원래 떠나면 새로운 꽃을 찾는 법이니, 미리 마음의 정리를 하세요.”",
        empathy: 5,
        reply: "그런 잔인한 말을... 저는 끝까지 님의 마음을 되돌리기 위해 울며 매달릴 것입니다!"
      },
      {
        text: "“강 건너편으로 사람을 보내 님이 어떤 여자를 만나는지 감시해 볼까요?”",
        empathy: 10,
        reply: "감시한다고 마음을 붙잡을 수 있을까요. 오직 저의 변함없는 사랑만이 님의 발길을 돌릴 수 있겠지요."
      }
    ]
  }
];

let dmCurrentStep = 0;
let dmTotalEmpathy = 0;

function initDmGame() {
  dmCurrentStep = 0;
  dmTotalEmpathy = 0;

  const chatBox = document.getElementById('dm-chat-box');
  const choiceBox = document.getElementById('dm-choice-buttons');
  const resultBox = document.getElementById('dm-result-box');
  const scoreElem = document.getElementById('empathy-score');

  if (chatBox) chatBox.innerHTML = '';
  if (choiceBox) choiceBox.innerHTML = '';
  if (resultBox) resultBox.classList.add('hidden');
  if (scoreElem) scoreElem.innerText = '0점';

  showDmStep();
}

function showDmStep() {
  if (dmCurrentStep >= DM_SCENARIOS.length) {
    finishDmGame();
    return;
  }

  const scenario = DM_SCENARIOS[dmCurrentStep];
  addHeroineBubble(scenario.heroine);

  const choiceArea = document.getElementById('dm-choice-buttons');
  if (!choiceArea) return;

  choiceArea.innerHTML = '';

  scenario.choices.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = escapeHtml(c.text);
    btn.onclick = () => handleUserDmChoice(c);
    choiceArea.appendChild(btn);
  });
}

function handleUserDmChoice(choice) {
  // 사용자 말풍선 추가
  addUserBubble(choice.text);

  // 공감 점수 반영
  dmTotalEmpathy += choice.empathy;
  const scoreElem = document.getElementById('empathy-score');
  if (scoreElem) scoreElem.innerText = `${dmTotalEmpathy}점`;

  // 선택지 비활성화
  const choiceArea = document.getElementById('dm-choice-buttons');
  if (choiceArea) choiceArea.innerHTML = '<p class="text-sm text-gray-500 py-2">서경의 여인이 답변을 입력하고 있습니다...</p>';

  // 여인 리액션 딜레이 표시
  setTimeout(() => {
    addHeroineBubble(choice.reply);
    dmCurrentStep++;

    setTimeout(() => {
      showDmStep();
    }, 700);
  }, 600);
}

function addHeroineBubble(text) {
  const chatBox = document.getElementById('dm-chat-box');
  if (!chatBox) return;

  const timeStr = getCurrentTimeString();
  const row = document.createElement('div');
  row.className = 'chat-row heroine';
  row.innerHTML = `
    <div class="chat-bubble">
      ${escapeHtml(text)}
    </div>
    <span class="chat-time">${timeStr}</span>
  `;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addUserBubble(text) {
  const chatBox = document.getElementById('dm-chat-box');
  if (!chatBox) return;

  const timeStr = getCurrentTimeString();
  const row = document.createElement('div');
  row.className = 'chat-row user';
  row.innerHTML = `
    <span class="chat-time">${timeStr}</span>
    <div class="chat-bubble">
      ${escapeHtml(text)}
    </div>
  `;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function finishDmGame() {
  const choiceArea = document.getElementById('dm-choice-area');
  const resultBox = document.getElementById('dm-result-box');
  const title = document.getElementById('dm-result-title');
  const desc = document.getElementById('dm-result-desc');

  if (choiceArea) choiceArea.classList.add('hidden');
  if (resultBox) resultBox.classList.remove('hidden');

  if (title && desc) {
    if (dmTotalEmpathy >= 90) {
      title.innerText = `🏆 최종 공감도: ${dmTotalEmpathy}점 (만점!) - 「서경의 여인 영혼의 단짝」`;
      desc.innerText = '서경별곡 화자의 이별 거부 태도, 구슬가의 신의, 사공 원망의 심리 기제, 꽃(새 여인)에 대한 인간적 질투까지 작품의 모든 심층 정서를 완벽하게 공감하고 이해하셨습니다!';
    } else if (dmTotalEmpathy >= 60) {
      title.innerText = `✨ 최종 공감도: ${dmTotalEmpathy}점 - 「고려가요 다정한 조언자」`;
      desc.innerText = '화자의 슬픔과 고뇌를 따뜻하게 어루만져 주었습니다. 개념정리 탭의 화자의 정서 변화를 한 번 더 복습하면 최고의 공감 마스터가 될 수 있습니다!';
    } else {
      title.innerText = `💬 최종 공감도: ${dmTotalEmpathy}점 - 「서경 나루터의 행인」`;
      desc.innerText = '화자의 불타는 적극적 사랑을 조금은 낯설게 느끼셨군요! <가시리>의 소극적 태도와 <서경별곡>의 적극적 태도를 비교해 보면 화자의 마음을 더 잘 이해할 수 있습니다.';
    }
  }

  const chatBox = document.getElementById('dm-chat-box');
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

function restartDmGame() {
  const choiceArea = document.getElementById('dm-choice-area');
  if (choiceArea) choiceArea.classList.remove('hidden');
  initDmGame();
}

// ==========================================================
// 5. 교실 수업 모드 및 UI 인터랙션 기능
// ==========================================================
// 교실 대형 화면 수업 모드 토글
function toggleClassroomMode() {
  const body = document.body;
  const btn = document.getElementById('btn-classroom-mode');

  body.classList.toggle('classroom-mode');
  const isActive = body.classList.contains('classroom-mode');

  if (btn) {
    btn.classList.toggle('active-mode', isActive);
    const textSpan = btn.querySelector('.btn-text');
    if (textSpan) {
      textSpan.innerText = isActive ? '수업 모드 켜짐 (글자 확대)' : '교실 수업 모드';
    }
  }
}

// 현대어 풀이 전체 가리기/보이기 토글 (발문식 수업 지원)
function toggleAllTranslation() {
  const body = document.body;
  body.classList.toggle('hide-translation');

  const isHidden = body.classList.contains('hide-translation');
  const textSpan = document.getElementById('trans-toggle-text');

  if (textSpan) {
    textSpan.innerText = isHidden ? '현대어 풀이 보이기' : '현대어 풀이 가리기';
  }
}

// 연별 집중 필터링 (전체 / 1연 / 2연 / 3연)
function filterStanza(stanza) {
  const cards = document.querySelectorAll('.stanza-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => btn.classList.remove('active'));

  if (stanza === 'all') {
    cards.forEach(card => card.style.display = 'flex');
    if (filterBtns[0]) filterBtns[0].classList.add('active');
  } else {
    cards.forEach(card => {
      const cardStanza = Number(card.getAttribute('data-stanza'));
      if (cardStanza === stanza) {
        card.style.display = 'flex';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        card.style.display = 'none';
      }
    });

    const targetIdx = Number(stanza);
    if (filterBtns[targetIdx]) filterBtns[targetIdx].classList.add('active');
  }
}

// 탭 전환
function switchTab(tabKey) {
  const tabs = ['study', 'quiz', 'game'];

  tabs.forEach(t => {
    const tabBtn = document.getElementById(`tab-${t}`);
    const sec = document.getElementById(`sec-${t}`);

    if (t === tabKey) {
      if (tabBtn) {
        tabBtn.classList.add('active');
        tabBtn.setAttribute('aria-selected', 'true');
      }
      if (sec) sec.classList.remove('hidden');
    } else {
      if (tabBtn) {
        tabBtn.classList.remove('active');
        tabBtn.setAttribute('aria-selected', 'false');
      }
      if (sec) sec.classList.add('hidden');
    }
  });

  // 퀴즈 탭 첫 진입 시 랜덤 10문항 생성
  if (tabKey === 'quiz' && currentQuizSet.length === 0) {
    initRandomQuiz();
  }

  // 게임 탭 첫 진입 시 시나리오 초기화
  if (tabKey === 'game' && dmCurrentStep === 0) {
    initDmGame();
  }
}

// 시어 모달 팝업
function showWordModal(keyword) {
  const data = WORD_DICTIONARY[keyword];
  if (!data) return;

  const modal = document.getElementById('word-modal');
  const title = document.getElementById('modal-word-title');
  const meaning = document.getElementById('modal-word-meaning');
  const symbol = document.getElementById('modal-word-symbol');
  const exam = document.getElementById('modal-word-exam');

  if (title) title.innerText = data.title;
  if (meaning) meaning.innerText = data.meaning;
  if (symbol) symbol.innerText = data.symbol;
  if (exam) exam.innerText = data.exam;

  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
}

function closeWordModal() {
  const modal = document.getElementById('word-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

function closeWordModalOnBackdrop(e) {
  if (e && e.target && e.target.id === 'word-modal') {
    closeWordModal();
  }
}

// 교실 판서 요약 모달
function openClassroomBoard() {
  const modal = document.getElementById('board-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
}

function closeBoardModal() {
  const modal = document.getElementById('board-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

function closeBoardModalOnBackdrop(e) {
  if (e && e.target && e.target.id === 'board-modal') {
    closeBoardModal();
  }
}

// 전역 윈도우 명시적 등록 (HTML 인라인 onclick 이벤트 100% 보장)
window.showWordModal = showWordModal;
window.closeWordModal = closeWordModal;
window.closeWordModalOnBackdrop = closeWordModalOnBackdrop;
window.openClassroomBoard = openClassroomBoard;
window.closeBoardModal = closeBoardModal;
window.closeBoardModalOnBackdrop = closeBoardModalOnBackdrop;
window.switchTab = switchTab;
window.toggleClassroomMode = toggleClassroomMode;
window.toggleAllTranslation = toggleAllTranslation;
window.filterStanza = filterStanza;
window.initRandomQuiz = initRandomQuiz;
window.gradeQuiz = gradeQuiz;
window.scrollToQuizReview = scrollToQuizReview;
window.selectChoiceOption = selectChoiceOption;
window.selectOxOption = selectOxOption;
window.handleShortInput = handleShortInput;
window.restartDmGame = restartDmGame;


// 헬퍼 함수들
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCurrentTimeString() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12 || 12;
  return `${ampm} ${hours}:${minutes}`;
}

// ==========================================================
// 6. 초기화 실행
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  // 초기 탭 설정: 개념정리
  switchTab('study');

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeWordModal();
      closeBoardModal();
    }
  });
});
