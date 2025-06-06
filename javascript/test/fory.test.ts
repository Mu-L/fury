/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Fory, { TypeInfo, Type } from '../packages/fory/index';
import { describe, expect, test } from '@jest/globals';
import { fromUint8Array } from '../packages/fory/lib/platformBuffer';
import { MAGIC_NUMBER } from '../packages/fory/lib/type';

const hight = MAGIC_NUMBER >> 8;
const low = MAGIC_NUMBER & 0xff;

describe('fory', () => {
    test('should deserialize null work', () => {
        const fory = new Fory();

        expect(fory.deserialize(new Uint8Array([low, hight, 1]))).toBe(null)
    });

    test('should deserialize big endian work', () => {
        const fory = new Fory();
        try {
            fory.deserialize(new Uint8Array([low, hight, 0]))
            throw new Error('unreachable code')
        } catch (error) {
            expect(error.message).toBe('big endian is not supported now');
        }
    });

    test('should deserialize xlang disable work', () => {
        const fory = new Fory();
        try {
            fory.deserialize(new Uint8Array([low, hight, 2]))
            throw new Error('unreachable code')
        } catch (error) {
            expect(error.message).toBe('support crosslanguage mode only');
        }
    });

    test('should deserialize xlang disable work', () => {
        const fory = new Fory();
        try {
            fory.deserialize(new Uint8Array([low, hight, 14]))
            throw new Error('unreachable code')
        } catch (error) {
            expect(error.message).toBe('outofband mode is not supported now');
        }
    });

    test('should register work', () => {
        const fory = new Fory();
        const { serialize, deserialize } = fory.registerSerializer(Type.array(Type.string()));
        const bin = serialize(["hello", "world"]);
        expect(deserialize(bin)).toEqual(["hello", "world"]);
    });

    describe('serializer typeinfo should work', () => {
        test('can serialize and deserialize primitive types', () => {
            const typeinfo = Type.int8()
            testTypeInfo(typeinfo, 123)

            const typeinfo2 = Type.int16()
            testTypeInfo(typeinfo2, 123)

            const typeinfo3 = Type.int32()
            testTypeInfo(typeinfo3, 123)

            const typeinfo4 = Type.bool()
            testTypeInfo(typeinfo4, true)

            // has precision problem
            // const typeinfo5 = Type.float()
            // testTypeInfo(typeinfo5, 123.456)

            const typeinfo6 = Type.float64()
            testTypeInfo(typeinfo6, 123.456789)

            const typeinfo7 = Type.binary()
            testTypeInfo(typeinfo7, new Uint8Array([1, 2, 3]), fromUint8Array(new Uint8Array([1, 2, 3])));

            const typeinfo8 = Type.string()
            testTypeInfo(typeinfo8, '123')

            const typeinfo9 = Type.set(Type.string())
            testTypeInfo(typeinfo9, new Set(['123']))
        })

        test('can serialize and deserialize array', () => {
            const typeinfo = Type.array(Type.int8())
            testTypeInfo(typeinfo, [1, 2, 3])
            testTypeInfo(typeinfo, [])
        })

        test('can serialize and deserialize tuple', () => {
            const typeinfo = Type.tuple([Type.int8(), Type.int16(), Type.timestamp()] as const)
            testTypeInfo(typeinfo, [1, 2, new Date()])
        })


        function testTypeInfo(typeinfo: TypeInfo, input: any, expected?: any) {
            const fory = new Fory();
            const serialize = fory.registerSerializer(typeinfo);
            const result = serialize.deserialize(
                serialize.serialize(input)
            );
            expect(result).toEqual(expected ?? input)
        }
    })
});
