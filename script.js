document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('answer');
    const historyDisplay = document.getElementById('history');
    const buttons = document.querySelectorAll('button');

    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;

    // イベントリスナーを各ボタンに追加
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // 数字ボタン
            if (button.classList.contains('number')) {
                inputNumber(button.value);
            }
            // 演算子ボタン
            else if (button.classList.contains('operator') && button.value) {
                inputOperator(button.value);
            }
            // クリアボタン
            else if (button.id === 'clear') {
                clear();
            }
            // 削除ボタン
            else if (button.id === 'delete') {
                deleteNumber();
            }
            // イコールボタン
            else if (button.id === 'equals') {
                calculate();
            }
        });
    });

    // キーボード入力のサポート
    document.addEventListener('keydown', (event) => {
        if (/[0-9]/.test(event.key)) {
            inputNumber(event.key);
        } else if (event.key === '.') {
            inputNumber('.');
        } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/' || event.key === '%') {
            inputOperator(event.key);
        } else if (event.key === 'Enter' || event.key === '=') {
            calculate();
        } else if (event.key === 'Backspace') {
            deleteNumber();
        } else if (event.key === 'Escape') {
            clear();
        }
    });

    // 数字入力の処理
    function inputNumber(number) {
        // 画面リセットが必要な場合
        if (resetScreen) {
            display.value = '';
            resetScreen = false;
        }

        // 小数点が既に存在する場合は2つ目の小数点を防止
        if (number === '.' && display.value.includes('.')) return;

        // 入力された数字を表示に追加
        display.value += number;
        currentInput = display.value;
    }

    // 演算子入力の処理
    function inputOperator(op) {
        // 現在の入力がない場合は何もしない
        if (display.value === '') return;

        // 計算実行
        if (previousInput !== '') {
            calculate();
        }

        // 現在の値を保存し、次の入力に備える
        previousInput = display.value;
        operation = op;
        historyDisplay.textContent = `${previousInput} ${getOperatorSymbol(op)}`;
        resetScreen = true;
    }

    // 計算処理
    function calculate() {
        // 前の入力か現在の入力がない場合は何もしない
        if (previousInput === '' || display.value === '') return;

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(display.value);

        // 演算子に応じた計算
        switch(operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                // ゼロ除算チェック
                if (current === 0) {
                    alert('ゼロで割ることはできません');
                    clear();
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }

        // 履歴に計算式を表示
        historyDisplay.textContent = `${previousInput} ${getOperatorSymbol(operation)} ${display.value} =`;

        // 結果を表示し、状態をリセット
        display.value = roundResult(result);
        previousInput = '';
        currentInput = display.value;
        resetScreen = true;
    }

    // 小数点以下の桁数を制限
    function roundResult(number) {
        return Math.round(number * 1000000) / 1000000;
    }

    // 演算子記号の取得
    function getOperatorSymbol(operator) {
        switch(operator) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            case '%': return '%';
            default: return operator;
        }
    }

    // クリア処理
    function clear() {
        display.value = '';
        historyDisplay.textContent = '';
        previousInput = '';
        currentInput = '';
        operation = null;
    }

    // 1文字削除処理
    function deleteNumber() {
        display.value = display.value.slice(0, -1);
        currentInput = display.value;
    }
});
