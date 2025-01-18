import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
import { getHighestConsecutiveValue, getHighestValueDrop, getHighestValueDropSum, getValueDropPeriods } from "./utils";
import { Item } from "./types";

(async () => {
  const csvFilePath = path.resolve(__dirname, 'data/ceny_akcji.csv');
  
  const headers = ['id', 'date', 'price', 'currency'];
  
  const fileStream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });

  const parser = fileStream.pipe(parse({
    delimiter: ',',
    columns: headers,
  }));

  let data: Item[] = [];

  try {
    for await (const record of parser) {
      record.price = parseFloat(record.price);
      record.id = parseInt(record.id);
      data.push(record);
    }

    // Zad 1.
    const zad1 = getHighestValueDrop(data);
    console.log(`zad1: Najwiekszy spadek ceny - ${zad1.priceDrop}`);
    console.log(`Id: ${data[zad1.index-1].id} Dzien wczesniej: ${data[zad1.index-1].date} Cena: ${data[zad1.index-1].price}`)
    console.log(`Id: ${data[zad1.index].id} Dzien teraz: ${data[zad1.index].date} Cena: ${data[zad1.index].price}`)

    // Zad 2.
    const zad2 = getValueDropPeriods(data);
    console.log(`zad2: Liczba spadkow ceny - ${zad2}`);

    // Zad 3.
    const zad3 = getHighestValueDropSum(data);
    console.log(`zad3:`);
    console.log(`Liczba dni: ${zad3.daysCount}, Łączna wartość spadku: ${zad3.highestValueDropSum}, Początek spadku: ${zad3.valueDropStart}`)

    // Zad 4.
    const zad4 = getHighestConsecutiveValue(data);
    console.log("zad4:");
    console.log(`Liczba dni: ${zad4.daysCount}, Niezmienna cena: ${zad4.highestConsecutiveValue}, Początek niezmiennej ceny: ${zad4.consecutiveValueStart}`);

  } catch (error) {
    console.error(error);
  }
})();