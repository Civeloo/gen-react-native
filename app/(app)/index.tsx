import { ClearTodos } from '@/components/clear-todos';
import { ListTodo } from '@/components/list-todo';
import { NewTodoForm } from '@/components/new-todo-form';
import { DONE_CELL, TEXT_CELL, TITLE_VALUES, TODO_TABLE } from '@/services/database/database';
import Todos from '@/services/database/todos.model';
import { useSession } from '@/services/session/ctx';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet, Text,
  View
} from "react-native";
import {
  useHasTable,
  useValue
} from 'tinybase/ui-react';

export default function Index() {
  const { signOut } = useSession();

  const getData = () => Todos.all();
  const [data, setData] = useState(getData());
  const refreshData = () => setData(getData());
  const handleSave = (newText) => {
    Todos.add({ [TEXT_CELL]: newText, [DONE_CELL]: false });
    refreshData();
  };
  const handleRemove = (id) => {
    Todos.remove(id);
    refreshData();
  }
  const handleClear = () => {
    refreshData();
  }

  const handleSignOut = () => {
    signOut();
    router.replace('/');
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.heading}>{useValue(TITLE_VALUES)}</Text>
      <NewTodoForm onSave={handleSave} />
      <ListTodo data={data} onRemove={handleRemove} />
      <ClearTodos show={useHasTable(TODO_TABLE)} onPress={handleClear} />
      <Text
        onPress={handleSignOut}>
        Sign Out
      </Text>
    </View>
  );
}

// Styles for the app.
const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
