import { createSlice } from "@reduxjs/toolkit";

//Hash table
class HashTable {
  constructor(size) {
    this.data = new Array(size); //Donde almacenaremos los pares clave/valor
    this.size = 0;
  }

  _hash(key) {
    let hash = 0;

    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * i) % this.data.length;
    }

    return hash;
  }

  set(key, value) {
    let index = this._hash(key);
    let bucket = this.data[index];
    if (bucket && bucket.length >= 0) {
      this.data[index].push([key, value]);
    } else {
      this.data[index] = [];
      this.data[index].push([key, value]);
    }
  }

  get(key) {
    let index = this._hash(key);
    let bucket = this.data[index];
    if (bucket && bucket.length > 0) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === key) {
          return bucket[i][1];
        }
      }
    } else {
      return undefined;
    }
  }

  getValue(value) {
    let index = this._hash(value);
    let bucket = this.data[index];
    if (bucket && bucket.length > 0) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][1] === value) {
          return bucket[i][0];
        }
      }
    } else {
      return undefined;
    }
  }
}

//Set hash table
const myHashTable = new HashTable(50);
myHashTable.set("I", 1);
myHashTable.set("V", 5);
myHashTable.set("X", 10);
myHashTable.set("L", 50);
myHashTable.set("C", 100);
myHashTable.set("D", 500);
myHashTable.set("M", 1000);

export const convertSlice = createSlice({
  name: "convert",
  initialState: {
    value: "",
  },
  reducers: {
    romanToDecimal: (state, action) => {
      let romNumber = action.payload.toUpperCase();
      let num = myHashTable.get(romNumber.charAt(0));

      if (typeof action.payload != "string") {
        alert("Numero romano no válido");
      }

      for (let i = 1; i < romNumber.length; i++) {
        let curr = myHashTable.get(romNumber.charAt(i));
        let last = myHashTable.get(romNumber.charAt(i - 1));

        if (curr <= last) {
          num += curr;
        } else {
          num = num - last * 2 + curr;
        }
      }
      state.value = num;
    },

    decimalToRoman: (state, action) => {
      if (action.payload > 4000) {
        alert("El número no puede ser mayor a 3999");
      }

      let uni = action.payload % 10; //6
      let dec = ((action.payload % 100) - (action.payload % 10)) / 10; //9
      let cen = ((action.payload % 1000) - (action.payload % 100)) / 100; //9
      let mill = ((action.payload % 10000) - (action.payload % 1000)) / 1000; //1
      let rUni = null;
      let rDec = null;
      let rCen = null;
      let rMill = null;

      //Unidades
      if (uni === 1) {
        rUni = myHashTable.getValue(1);
      }
      if (uni < 4) {
        let sum = uni / 1;
        rUni = myHashTable.getValue(1).repeat(sum) || "";
      }
      if (uni === 4) {
        rUni = "IV";
      }
      if (uni === 5) {
        rUni = myHashTable.getValue(1 * uni) || "";
      }
      if (uni > 5 && uni < 9) {
        let res = uni - 5;
        let div = res / 1;
        let result = myHashTable.getValue(1).repeat(div);
        let sum = myHashTable.getValue(5);
        rUni = sum + result || "";
      }
      if (uni === 9) {
        rUni = "IX";
      }

      //Decenas
      if (dec === 1) {
        rDec = myHashTable.getValue(10);
      }
      if (dec < 4) {
        let sum = dec / 1;
        rDec = myHashTable.getValue(10).repeat(sum) || "";
      }
      if (dec === 4) {
        rDec = "XL";
      }
      if (dec === 5) {
        rDec = myHashTable.getValue(10 * dec) || "";
      }
      if (dec > 5 && dec < 9) {
        let res = dec - 5;
        let div = res / 1;
        let result = myHashTable.getValue(10).repeat(div);
        let sum = myHashTable.getValue(50);
        rDec = sum + result || "";
      }
      if (dec === 9) {
        rDec = "XC";
      }

      //Centenas
      if (cen === 1) {
        rCen = myHashTable.getValue(100);
      }
      if (cen < 4) {
        let sum = cen / 1;
        rCen = myHashTable.getValue(100).repeat(sum) || "";
      }
      if (cen === 4) {
        rCen = "CD";
      }
      if (cen === 5) {
        rCen = myHashTable.getValue(100 * cen) || "";
      }
      if (cen > 5 && cen < 9) {
        let res = cen - 5;
        let div = res / 1;
        let result = myHashTable.getValue(100).repeat(div);
        let sum = myHashTable.getValue(500);
        rCen = sum + result || "";
      }
      if (cen === 9) {
        rCen = "CM";
      }

      //Millares
      if (mill === 1) {
        rMill = myHashTable.getValue(1000) || "";
      }
      if (mill < 4) {
        let sum = mill / 1;
        rMill = myHashTable.getValue(1000).repeat(sum) || "";
      }

      let roman = rMill + rCen + rDec + rUni;
      state.value = roman;
    },
  },
});

export const { romanToDecimal, decimalToRoman } = convertSlice.actions;

export default convertSlice.reducer;
