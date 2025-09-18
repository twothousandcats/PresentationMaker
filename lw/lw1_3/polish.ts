function calc(expression: string): void {
    const cleanedExpression = expression
        .replace(/\s+/g, ' ')
        .replace(/[()]/g, '')
        .trim();

    if (!cleanedExpression.length) {
        console.log('Ошибка: пустое выражение');

        return;
    }

    const tokens = cleanedExpression.split(' ');
    const stack: number[] = [];

    for (let i = tokens.length - 1; i >= 0; i--) {
        const token = tokens[i];

        if (isOperator(token)) {
            if (stack.length < 2) {
                console.log('Ошибка: недостаточно операндов для оператора: ', token);
                return;
            }

            const operand1 = stack.pop()!;
            const operand2 = stack.pop()!;
            const result = performOperation(token, operand1, operand2);

            if (result === null) {
                console.log('Ошибка: деление на ноль');
                return;
            }

            stack.push(result);
        } else if (isNumber(token)) {
            stack.push(parseInt(token));
        } else {
            console.log('Ошибка: неверный токен', token);
            return;
        }
    }

    if (stack.length !== 1) {
        console.log('Ошибка: неверное выражение');
        return;
    }

    console.log('Результат:', stack[0]);
}

function isOperator(token: string): boolean {
    return ['+', '-', '*', '/'].includes(token);
}

function isNumber(token: string): boolean {
    return !isNaN(parseInt(token)) && isFinite(parseInt(token));
}

function performOperation(operator: string, operand1: number, operand2: number): number | null {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            if (operand2 === 0) {
                return null; // Деление на ноль
            }
            return operand1 / operand2;
        default:
            return 0;
    }
}

calc('  )((())     +           3 4     ');
calc('* (- 5 6) 7');
calc('/ 10 2');
calc('- 8 3');
calc('* + 2 3 4');
calc('+ 1 * 2 3');


calc('+ 3');
calc('/ 5 0');
calc('& 3 4');     