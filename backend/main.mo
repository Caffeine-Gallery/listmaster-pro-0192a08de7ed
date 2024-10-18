import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Hash "mo:base/Hash";
import List "mo:base/List";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor {
  // Define the ShoppingItem type
  type ShoppingItem = {
    id: Nat;
    text: Text;
    itemType: Text;
    completed: Bool;
  };

  // Initialize a stable variable to store shopping items
  stable var shoppingList: [ShoppingItem] = [];
  stable var nextId: Nat = 0;

  // Function to add a new item to the shopping list
  public func addItem(text: Text, itemType: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem: ShoppingItem = {
      id = id;
      text = text;
      itemType = itemType;
      completed = false;
    };
    shoppingList := Array.append(shoppingList, [newItem]);
    id
  };

  // Function to get all items in the shopping list
  public query func getItems() : async [ShoppingItem] {
    shoppingList
  };

  // Function to toggle the completed status of an item
  public func toggleCompleted(id: Nat) : async Bool {
    let index = Array.indexOf<ShoppingItem>({ id = id; text = ""; itemType = ""; completed = false }, shoppingList, func(a, b) { a.id == b.id });
    switch (index) {
      case null { false };
      case (?i) {
        let item = shoppingList[i];
        let updatedItem = {
          id = item.id;
          text = item.text;
          itemType = item.itemType;
          completed = not item.completed;
        };
        shoppingList := Array.tabulate<ShoppingItem>(shoppingList.size(), func (j) {
          if (j == i) { updatedItem } else { shoppingList[j] }
        });
        true
      };
    }
  };

  // Function to delete an item from the shopping list
  public func deleteItem(id: Nat) : async Bool {
    let newList = Array.filter<ShoppingItem>(shoppingList, func(item) { item.id != id });
    if (newList.size() < shoppingList.size()) {
      shoppingList := newList;
      true
    } else {
      false
    }
  };

  // Function to get item type statistics
  public query func getItemTypeStats() : async [(Text, Nat)] {
    let typeMap = HashMap.HashMap<Text, Nat>(10, Text.equal, Text.hash);
    for (item in shoppingList.vals()) {
      let count = Option.get(typeMap.get(item.itemType), 0);
      typeMap.put(item.itemType, count + 1);
    };
    Iter.toArray(typeMap.entries())
  };
}
