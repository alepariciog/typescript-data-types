<h1 align="center">
  🌠 Optional, Either and Result in Typescript 🌠
</h1>

<p align="center">
  Implementation of useful data types in typescript that are available in other languages.
</p>

## 💡 Current data types

A complete suite of test covering the different methods is provided. Multiple operations are attached for each one of the data types. It is recommended to give an overview to the documentation of the implemented operations. Following, a small description an example of usage of each one of the available types.

### **Optional:**

Java-like optional with extra operations. Encapsulates the idea of having or not a value. Similar to Maybe data type.

```
    const user = userRepository.get(userId)
              .map(user => user.getId())
              .orElseThrow(() => new UserNotFoundError());
```

### **Either:**

Encapsulates the possibility of having only one of two values of different types, a left type and a right type. Usually right type is associated to a 'correct' value, while the left value is more associated to errors.

```
    const value = Either.right<boolean, number>(0)
              .bimap(value => +value, value => value + 1)
              .get();
```

### **Result:**

Encapsulates the possibility of having an error result or a valid result. Similar to Either, but enfocing the idea of an error result being an error.

```
    const value = Result.ok(3).get();
```

---

<br/>

![status](https://img.shields.io/badge/status-up-brightgreen) ![](https://visitor-badge.lithub.cc/badge?page_id=github.com/alepariciog/event-buses)
