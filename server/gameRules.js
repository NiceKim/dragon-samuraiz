// 게임 규칙 및 승패 판단 로직

const CHOICES = {
  slash: { type: 'attack', value: 1 },
  powerSlam: { type: 'attack', value: 2 },
  parry: { type: 'defense', value: 1 },
  focus: { type: 'defense', value: 0 }
};

// 가위바위보 결과 계산
const calculateResult = (player1Choice, player2Choice) => {
  if (player1Choice === player2Choice) return 'draw';

  const p1 = CHOICES[player1Choice];
  const p2 = CHOICES[player2Choice];

  // 공격 선택지가 상대보다 수치가 높으면 승리
  if (p1.type === 'attack' && p1.value > p2.value) return 'win';
  if (p2.type === 'attack' && p2.value > p1.value) return 'lose';

  return 'draw';
};

module.exports = {
  calculateResult
}; 