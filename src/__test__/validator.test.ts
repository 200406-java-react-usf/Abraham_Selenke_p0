import { isValidId, isValidString, isValidObject, isPropertyOf, isValidMoney, isValidBoolean, isEmptyObject } from "../util/validator";
import { User } from "../models/users";
import { Account } from "../models/account";

describe('validator', () => {

    test('should return true when isValidId is provided a valid id', () => {
        
        expect.assertions(3);

        let result1 = isValidId(1);
        let result2 = isValidId(999999);
        let result3 = isValidId(Number('123'));

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidId is provided a invalid id (falsy)', () => {

        expect.assertions(0);

        let result1 = isValidId(NaN);
        let result2 = isValidId(0);
        let result3 = isValidId(Number(null));

        expect(result1).toBeFalsy;
        expect(result2).toBeFalsy;
        expect(result3).toBeFalsy;

    });

    test('should return false when isValidId is provided a invalid id (decimal)', () => {

        expect.assertions(3);

        let result1 = isValidId(3.14);
        let result2 = isValidId(0.01);
        let result3 = isValidId(Number(4.20));

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isValidId is provided a invalid id (non-positive)', () => {

        expect.assertions(3);

        let result1 = isValidId(0);
        let result2 = isValidId(-1);
        let result3 = isValidId(Number(-23));

        expect(result1).toBe(0);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return true when isValidMoney is provided a valid id', () => {
        
        expect.assertions(3);

        let result1 = isValidMoney(1);
        let result2 = isValidMoney(999999);
        let result3 = isValidMoney(Number('123'));

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidMoney is provided a invalid id (falsy)', () => {

        expect.assertions(0);

        let result1 = isValidMoney(NaN);
        let result2 = isValidMoney(0);
        let result3 = isValidMoney(Number(null));

        expect(result1).toBeFalsy;
        expect(result2).toBeFalsy;
        expect(result3).toBeFalsy;

    });

    test('should return false when isValidMoney is provided a valid id (decimal)', () => {

        expect.assertions(3);

        let result1 = isValidMoney(3.14);
        let result2 = isValidMoney(0.01);
        let result3 = isValidMoney(Number(4.20));

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidMoney is provided a invalid id (non-positive)', () => {

        expect.assertions(3);

        let result1 = isValidMoney(0);
        let result2 = isValidMoney(-1);
        let result3 = isValidMoney(Number(-23));

        expect(result1).toBe(0);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return true when isValidStrings is provided valid string(s)', () => {

        expect.assertions(3);

        let result1 = isValidString('valid');
        let result2 = isValidString('valid', 'string', 'values');
        let result3 = isValidString(String('weird'), String('but valid'));

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return true when isValidBoolean is provided valid string(s)', () => {

        expect.assertions(2);

        let result1 = isValidBoolean(true);
        let result2 = isValidBoolean(false);

        expect(result1).toBe(true);
        expect(result2).toBe(false);

    });

    test('should return false when isValidStrings is provided invalid string(s)', () => {

        expect.assertions(3);

        let result1 = isValidString('');
        let result2 = isValidString('some valid', '', 'but not all');
        let result3 = isValidString(String(''), String('still weird'));

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return true when isValidObject is provided valid object with no nullable props', () => {

        expect.assertions(2);

        let result1 = isValidObject(new Account(1, 200, new Date(), 'checking'));
        let result2 = isValidObject(new User(1, 'turmboi', 'numberone', 'turm', 'boi', 'JJ', 'jj@test.com', 'User'));

        expect(result1).toBe(true);
        expect(result2).toBe(true);

    });

    test('should return true when isValidObject is provided valid object with nullable prop(s)', () => {

        expect.assertions(2);

        let result1 = isValidObject(new Account(3, 200, new Date(), 'checking'), 'id');
        let result2 = isValidObject(new User(3, 'turmboi', 'numberone', 'turm', 'boi', 'JJ', 'jj@test.com', 'User'), 'id');

        expect(result1).toBe(true);
        expect(result2).toBe(true);

    });

    test('should return false when isValidObject is provided invalid object with no nullable prop(s)', () => {

        expect.assertions(2);

        let result1 = isValidObject(new Account(3, 200, new Date(), ''));
        let result2 = isValidObject(new User(3, 'turmboi', 'numberone', 'turm', 'boi', '', 'jj@test.com', 'User'));

        expect(result1).toBe(false);
        expect(result2).toBe(false);

    });

    test('should return false when isValidObject is provided invalid object with some nullable prop(s)', () => {

        expect.assertions(2);

        let result1 = isValidObject(new Account(3, 200, new Date(), ''), 'id');
        let result2 = isValidObject(new User(3, 'turmboi', 'numberone', 'turm', 'boi', '', 'jj@test.com', 'User'), 'id');

        expect(result1).toBe(false);
        expect(result2).toBe(false);

    });

    test('should return true when isPropertyOf is provided a known property of a given constructable type', () => {

        expect.assertions(3);

        let result1 = isPropertyOf('id', User);
        let result2 = isPropertyOf('username', User);
        let result3 = isPropertyOf('balance', Account);

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isPropertyOf is provided a unknown property of a given constructable type', () => {

        expect.assertions(3);

        let result1 = isPropertyOf('not-real', User);
        let result2 = isPropertyOf('fake', User);
        let result3 = isPropertyOf('sav', Account);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isPropertyOf is provided a non-constructable type', () => {

        expect.assertions(4);

        let result1 = isPropertyOf('shouldn\'t work', {x: 'non-constructable'});
        let result2 = isPropertyOf('nope', 2);
        let result3 = isPropertyOf('nuh-uh', false);
        let result4 = isPropertyOf('won\'t work', Symbol('asd'));

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);  

    });

    test('should return false when isEmptyObject is provided an empty object', () => {

        expect.assertions(3);

        let result1 = isEmptyObject(['']);
        let result2 = isEmptyObject(['', '', '']);
        let result3 = isEmptyObject(['jk','','js']);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

})