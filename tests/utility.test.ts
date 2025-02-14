import Utility from '../src/main';

describe('Utility class tests', () => {
    let utility = Utility;

    
    test('should get value by path', () => {
        // Arrange
        const obj = { a: { b: { c: 42 } } };
        const path = 'a.b.c';
        const expectedOutput = 42;

        // Act
        const result = utility.get(obj, path);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should get ID from item', () => {
        // Arrange
        const item = { _id: '123' };
        const expectedOutput = '123';

        // Act
        const result = utility.getId(item);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should find item by ID', () => {
        // Arrange
        const list = [{ _id: '123' }, { _id: '456' }];
        const id = '123';
        const expectedOutput = { _id: '123' };

        // Act
        const result = utility.findById(list, id);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should replace item in list', () => {
        // Arrange
        const list = [{ _id: '123' }, { _id: '456' }];
        const newItem = { _id: '123', name: 'new' };
        const expectedOutput = [{ _id: '123', name: 'new' }, { _id: '456' }];

        // Act
        const result = utility.replaceBy(list, newItem);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should remove item from list', () => {
        // Arrange
        const list = [{ _id: '123' }, { _id: '456' }];
        const item = { _id: '123' };
        const expectedOutput = [{ _id: '456' }];

        // Act
        utility.remove(list, item);

        // Assert
        expect(list).toEqual(expectedOutput);
    });

    test('should get index of item in list', () => {
        // Arrange
        const list = [{ _id: '123' }, { _id: '456' }];
        const item = { _id: '123' };
        const expectedOutput = 0;

        // Act
        const result = utility.indexOf(list, item);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should check if any item matches filter', () => {
        // Arrange
        const items = [1, 2, 3];
        const filter = (item: number) => item > 2;
        const expectedOutput = true;

        // Act
        const result = utility.any(items, filter);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should change index of item in array', () => {
        // Arrange
        const arr = [1, 2, 3];
        const oldindex = 0;
        const newindex = 2;
        const expectedOutput = [2, 3, 1];

        // Act
        utility.changeIndex(arr, oldindex, newindex);

        // Assert
        expect(arr).toEqual(expectedOutput);
    });

    test('should check if list includes item', () => {
        // Arrange
        const list = [1, 2, 3];
        const item = 2;
        const expectedOutput = true;

        // Act
        const result = utility.includes(list, item);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should get distinct items', () => {
        // Arrange
        const items = [1, 2, 2, 3];
        const expectedOutput = [1, 2, 3];

        // Act
        const result = utility.distinct(items);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should get size of items', () => {
        // Arrange
        const items = [1, 2, 3];
        const expectedOutput = 3;

        // Act
        const result = utility.sizeOf(items);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should convert items to map', () => {
        // Arrange
        const items = [{ _id: '123' }, { _id: '456' }];
        const expectedOutput = new Map([['123', { _id: '123' }], ['456', { _id: '456' }]]);

        // Act
        const result = utility.toMap(items);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should convert items to set', () => {
        // Arrange
        const items = [{ _id: '123' }, { _id: '456' }];
        const expectedOutput = new Set(['123', '456']);

        // Act
        const result = utility.toSet(items);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should get first item matching filter', () => {
        // Arrange
        const items = [1, 2, 3];
        const filter = (item: number) => item > 1;
        const expectedOutput = 2;

        // Act
        const result = utility.first(items, filter);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should get last item in list', () => {
        // Arrange
        const items = [1, 2, 3];
        const expectedOutput = 3;

        // Act
        const result = utility.last(items);

        // Assert
        expect(result).toBe(expectedOutput);
    });

    test('should group items by property', () => {
        // Arrange
        const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }];
        const prop = 'type';
        const expectedOutput = [{ _id: 'a', children: [{ type: 'a' }, { type: 'a' }] }, { _id: 'b', children: [{ type: 'b' }] }];

        // Act
        const result = utility.groupBy(items, prop);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should take first N items', () => {
        // Arrange
        const items = [1, 2, 3];
        const length = 2;
        const expectedOutput = [1, 2];

        // Act
        const result = utility.take(items, length);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should skip first N items', () => {
        // Arrange
        const items = [1, 2, 3];
        const length = 1;
        const expectedOutput = [2, 3];

        // Act
        const result = utility.skip(items, length);

        // Assert
        expect(result).toEqual(expectedOutput);
    });

    test('should sort items by property', () => {
        // Arrange
        const items = [{ name: 'b' }, { name: 'a' }];
        const property = 'name';
        const expectedOutput = [{ name: 'a' }, { name: 'b' }];

        // Act
        utility.sort(items, property);

        // Assert
        expect(items).toEqual(expectedOutput);
    });

    test('should sort items numerically by property', () => {
        // Arrange
        const items = [{ value: 2 }, { value: 1 }];
        const property = 'value';
        const expectedOutput = [{ value: 1 }, { value: 2 }];
        
        // Act
        debugger; // Ensure your debugger is configured to pause here
        const result = utility.sortNumeric(items, property);
        
        // Assert
        expect(result).toEqual(expectedOutput);
    });

    // Add more tests for other methods as needed
});
