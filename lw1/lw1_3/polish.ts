function calc(expression: string): number {
    const tokens = expression.trim().split(/\s+/);
    let index = 0;

    try {
        const result = evaluateExpression(tokens);

        // Проверяем, что все токены были обработаны
        if (index < tokens.length) {
            throw new Error("Некорректное выражение: лишние токены");
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

        // Если токен - оператор
        if (isOperator(token)) {
            // Проверяем, есть ли скобка после оператора
            if (index < tokens.length && tokens[index] === '(') {
                index++; // Пропускаем открывающую скобку
            }

            const left = evaluateExpression(tokens);
            const right = evaluateExpression(tokens);

            // Проверяем, есть ли закрывающая скобка
            if (index < tokens.length && tokens[index] === ')') {
                index++; // Пропускаем закрывающую скобку
            }

            return performOperation(token, left, right);
        }
        // Если токен - число
        else if (isInteger(token)) {
            return parseInt(token, 10);
        }
        // Если токен - открывающая скобка
        else if (token === '(') {
            const result = evaluateExpression(tokens);

            // Должна быть закрывающая скобка
            if (index >= tokens.length || tokens[index] !== ')') {
                throw new Error("Отсутствует закрывающая скобка");
            }
            index++; // Пропускаем закрывающую скобку

            return result;
        }
        // Если токен - закрывающая скобка
        else if (token === ')') {
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
                // Целочисленное деление с округлением к нулю
                return Math.trunc(left / right);
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
console.log("Тестирование функции calc (целые числа):");
testCalc("+ 3 4");                       // Результат: 7
testCalc("* ( - 5 6 ) 7");               // Результат: -7
testCalc("/ * + 3 4 5 6");               // Результат: (3+4)*5/6 = 35/6 = 5
testCalc("- 10 3");                      // Результат: 7
testCalc("* ( + 2 3 ) ( - 5 1 )");       // Результат: 5 * 4 = 20
testCalc("/ 10 3");                      // Результат: 3 (целочисленное деление)
testCalc("/ -10 3");                     // Результат: -3 (целочисленное деление)
testCalc("/ 10 -3");                     // Результат: -3 (целочисленное деление)
testCalc("+ 1");                         // Ошибка: недостаточно операндов
testCalc("a 3 4");                       // Ошибка: неизвестный токен
testCalc("/ 5 0");                       // Ошибка: деление на ноль
testCalc("+ 3 4 5");                     // Ошибка: лишние токены
testCalc("+ 3.5 4");                     // Ошибка: нецелое число