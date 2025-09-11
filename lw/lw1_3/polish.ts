function calc(expression: string): number {
    const tokens = expression.trim().split(/\s+/);
    let index = 0;

    try {
        const result = evaluateExpression(tokens);
        if (index < tokens.length) {
            throw new Error("Некорректное выражение: лишний символ");
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Ошибка вычисления: ${error.message}`);
        }

        throw new Error("Неизвестная ошибка вычисления");
    }

    function evaluateExpression(tokens: string[]): number {
        if (index >= tokens.length) {
            throw new Error("Неожиданный конец выражения");
        }

        const token = tokens[index++];

        if (isOperator(token)) {
            if (index < tokens.length && tokens[index] === '(') {
                index++;
            }

            const left = evaluateExpression(tokens);
            const right = evaluateExpression(tokens);

            if (index < tokens.length && tokens[index] === ')') {
                index++;
            }

            return performOperation(token, left, right);
        } else if (isInteger(token)) {
            return parseInt(token, 10);
        } else if (token === '(') {
            const result = evaluateExpression(tokens);

            if (index >= tokens.length || tokens[index] !== ')') {
                throw new Error("Отсутствует закрывающая скобка");
            }
            index++;

            return result;
        } else if (token === ')') {
            throw new Error("Неожиданная закрывающая скобка");
        } else {
            throw new Error(`Неизвестный токен: ${token}`);
        }
    }

    function isOperator(token: string): boolean {
        return ['+', '-', '*', '/'].includes(token);
    }

    function isInteger(token: string): boolean {
        return /^-?\d+$/.test(token);
    }

    function performOperation(operator: string, left: number, right: number): number {
        switch (operator) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                if (right === 0) {
                    throw new Error("Деление на ноль");
                }

                return Math.trunc(left / right); // Целочисленное деление с округлением к нулю
            default:
                throw new Error(`Неизвестный оператор: ${operator}`);
        }
    }
}

// Тест
function testCalc(expression: string): void {
    try {
        const result = calc(expression);
        console.log(`${expression} = ${result}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Ошибка в выражении "${expression}": ${error.message}`);
        } else {
            console.error(`Неизвестная ошибка в выражении "${expression}"`);
        }
    }
}

// Тестирование функции
testCalc("+ 3 4");                       // Результат: 7
testCalc("* ( - 5 6 ) 7");               // Результат: -7
testCalc("/ * + 3 4 5 6");               // Результат: (3+4)*5/6 = 35/6 = 5
testCalc("- 10 3");                      // Результат: 7
testCalc("* - + 2 3 5 1");       // Результат: 5 * 4 = 20
testCalc("/ 10 3");                      // Результат: 3 (целочисленное деление)
testCalc("/ -10 3");                     // Результат: -3 (целочисленное деление)
testCalc("/ 10 -3");                     // Результат: -3 (целочисленное деление)
testCalc("+ 1");                         // Ошибка: недостаточно операндов
testCalc("a 3 4");                       // Ошибка: неизвестный токен
testCalc("/ 5 0");                       // Ошибка: деление на ноль
testCalc("+ 3 4 5");                     // Ошибка: лишние токены
testCalc("+ 3.5 4");                     // Ошибка: нецелое число