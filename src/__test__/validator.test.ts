import { isValidId, isValidString, isValidObject, isPropertyOf } from "../util/validator";
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

    // test('should return false when isValidId is provided a invalid id (falsy)', () => {

    //     // Arrange
    //     expect.assertions(3);

    //     // Act
    //     let result1 = isValidId(NaN);
    //     let result2 = isValidId(0);
    //     let result3 = isValidId(Number(null));

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);
    //     expect(result3).toBe(false);

    // });

    // test('should return false when isValidId is provided a invalid id (decimal)', () => {

    //     // Arrange
    //     expect.assertions(3);

    //     // Act
    //     let result1 = isValidId(3.14);
    //     let result2 = isValidId(0.01);
    //     let result3 = isValidId(Number(4.20));

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);
    //     expect(result3).toBe(false);

    // });

    // test('should return false when isValidId is provided a invalid id (non-positive)', () => {

    //     // Arrange
    //     expect.assertions(3);

    //     // Act
    //     let result1 = isValidId(0);
    //     let result2 = isValidId(-1);
    //     let result3 = isValidId(Number(-23));

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);
    //     expect(result3).toBe(false);

    // });

    // test('should return true when isValidStrings is provided valid string(s)', () => {

    //     // Arrange
    //     expect.assertions(3);

    //     // Act
    //     let result1 = isValidString('valid');
    //     let result2 = isValidString('valid', 'string', 'values');
    //     let result3 = isValidString(String('weird'), String('but valid'));

    //     // Assert
    //     expect(result1).toBe(true);
    //     expect(result2).toBe(true);
    //     expect(result3).toBe(true);

    // });

    // test('should return false when isValidStrings is provided invalid string(s)', () => {

    //     // Arrange
    //     expect.assertions(3);

    //     // Act
    //     let result1 = isValidString('');
    //     let result2 = isValidString('some valid', '', 'but not all');
    //     let result3 = isValidString(String(''), String('still weird'));

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);
    //     expect(result3).toBe(false);

    // });

    // test('should return true when isValidObject is provided valid object with no nullable props', () => {

    //     // Arrange
    //     expect.assertions(2);

    //     // Act
    //     let result1 = isValidObject(new Account(1, 200, new Date(), 'checking'));
    //     let result2 = isValidObject(new User(1, 'turmboi', 'numberone', 'turm', 'boi', 'JJ', 'jj@test.com', 'User');

    //     // Assert
    //     expect(result1).toBe(true);
    //     expect(result2).toBe(true);

    // });

    // test('should return true when isValidObject is provided valid object with nullable prop(s)', () => {

    //     // Arrange
    //     expect.assertions(2);

    //     // Act
    //     let result1 = isValidObject(new Account(3, 200, new Date(), 'checking'), 'id');
    //     let result2 = isValidObject(new User(3, 'turmboi', 'numberone', 'turm', 'boi', 'JJ', 'jj@test.com', 'User'), 'id');

    //     // Assert
    //     expect(result1).toBe(true);
    //     expect(result2).toBe(true);

    // });

    // test('should return false when isValidObject is provided invalid object with no nullable prop(s)', () => {

    //     // Arrange
    //     expect.assertions(2);

    //     // Act
    //     let result1 = isValidObject(new Account(3, 200, new Date(), ''));
    //     let result2 = isValidObject(new User(3, 'turmboi', 'numberone', 'turm', 'boi', '', 'jj@test.com', 'User'));

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);

    // });

    // test('should return false when isValidObject is provided invalid object with some nullable prop(s)', () => {

    //     // Arrange
    //     expect.assertions(2);

    //     // Act
    //     let result1 = isValidObject(new Account(3, 200, new Date(), ''), 'id');
    //     let result2 = isValidObject(new User(3, 'turmboi', 'numberone', 'turm', 'boi', '', 'jj@test.com', 'User'), 'id');

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);

    // });

    // test('should return true when isPropertyOf is provided a known property of a given constructable type', () => {

    //     // Arrange
    //     expect.assertions(3);

    //     // Act
    //     let result1 = isPropertyOf('id', User);
    //     let result2 = isPropertyOf('username', User);
    //     let result3 = isPropertyOf('balance', Account);

    //     // Assert
    //     expect(result1).toBe(true);
    //     expect(result2).toBe(true);
    //     expect(result3).toBe(true);

    // });

    // test('should return false when isPropertyOf is provided a unknown property of a given constructable type', () => {

    //     // Arrange
    //     expect.assertions(3);

    //     // Act
    //     let result1 = isPropertyOf('not-real', User);
    //     let result2 = isPropertyOf('fake', User);
    //     let result3 = isPropertyOf('sav', Account);

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);
    //     expect(result3).toBe(false);

    // });

    // test('should return false when isPropertyOf is provided a non-constructable type', () => {

    //     // Arrange
    //     expect.assertions(4);

    //     // Act
    //     let result1 = isPropertyOf('shouldn\'t work', {x: 'non-constructable'});
    //     let result2 = isPropertyOf('nope', 2);
    //     let result3 = isPropertyOf('nuh-uh', false);
    //     let result4 = isPropertyOf('won\'t work', Symbol('asd'));

    //     // Assert
    //     expect(result1).toBe(false);
    //     expect(result2).toBe(false);
    //     expect(result3).toBe(false);
    //     expect(result4).toBe(false);  

    // });

})