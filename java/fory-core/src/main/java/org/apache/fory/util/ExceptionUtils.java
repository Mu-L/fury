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

package org.apache.fory.util;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import org.apache.fory.Fory;
import org.apache.fory.collection.ObjectArray;
import org.apache.fory.exception.DeserializationException;
import org.apache.fory.exception.ForyException;
import org.apache.fory.memory.Platform;
import org.apache.fory.reflect.ReflectionUtils;
import org.apache.fory.resolver.MapRefResolver;

/** Util for java exceptions. */
public class ExceptionUtils {
  private static final Field detailMessageField;

  static {
    try {
      detailMessageField = Throwable.class.getDeclaredField("detailMessage");
    } catch (NoSuchFieldException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * Try to set `StackOverflowError` exception message. Returns passed exception if set succeed, or
   * null if failed.
   */
  public static StackOverflowError trySetStackOverflowErrorMessage(
      StackOverflowError e, String message) {
    if (detailMessageField != null) {
      ReflectionUtils.setObjectFieldValue(e, detailMessageField, message);
      return e;
    } else {
      return null;
    }
  }

  public static RuntimeException handleReadFailed(Fory fory, Throwable t) {
    if (fory.getRefResolver() instanceof MapRefResolver) {
      ObjectArray readObjects = ((MapRefResolver) fory.getRefResolver()).getReadObjects();
      // carry with read objects for better trouble shooting.
      List<Object> objects = Arrays.asList(readObjects.objects).subList(0, readObjects.size);
      throw new DeserializationException(objects, t);
    } else if (t instanceof Exception && !(t instanceof ForyException)) {
      throw new DeserializationException("Failed to deserialize input", t);
    } else {
      Platform.throwException(t);
      throw new IllegalStateException("unreachable");
    }
  }

  public static void ignore(Object... args) {}
}
