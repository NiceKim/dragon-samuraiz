// 게임 규칙 및 승패 판단 로직

// 가위바위보 결과 계산
const calculateResult = (player1Choice, player2Choice) => {
  if (player1Choice === player2Choice) return 'draw';
  
  const rules = {
    'rock': 'scissors',
    'paper': 'rock', 
    'scissors': 'paper'
  };
  
  return rules[player1Choice] === player2Choice ? 'win' : 'lose';
};

module.exports = {
  calculateResult
}; 