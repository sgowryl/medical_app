import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TextInput,
  FlatList,
  Button,
  useWindowDimensions,
} from "react-native";
import { useState, useEffect } from "react";
import HTML from "react-native-render-html";

export default function App() {
  const { width } = useWindowDimensions();
  const [name, setName] = useState("");
  const [postList, setPostList] = useState([]);
  const fetchData = async () => {
    try {
      const query = "blisters";
      console.log(name);
      const response = await fetch(`https://api.nhs.uk/conditions/${name}`, {
        headers: {
          "subscription-key": "13a43248355e41c0beedcd663fc14c2b",
        },
      });
      //const data = await response.json();
      const result = await response.json();
      const data = result.mainEntityOfPage;
      const headlines = data.map((el) => el.headline);
      const data1 = data.map((el) => el.mainEntityOfPage);
      const mappedData = data1.map((el) => {
        if (Array.isArray(el)) {
          return el.map((obj) => ({
            text: obj.text,
          }));
        } else {
          return el;
        }
      });
      const mappedResults = headlines.map((headline, index) => ({
        headline: headline,
        text: mappedData[index][0].text,
      }));
      //console.log(mappedResults);
      setPostList(mappedResults);
    } catch (e) {
      console.log(e);
    }
  };
  //console.log(postList);
  // useEffect(() => {
  //   fetchData();
  // }, []);
  const handleInputChange = (text) => {
    setName(text);
    //console.log(text);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleInputChange}
        defaultValue={name}
        //onChangeText={(newText) => setName(newText)}
        //defaultValue={name}
        placeholder="What is your Emergency?"
      />
      <Button title="Press me" onPress={() => fetchData()} />
      <View style={styles.listContainer}>
        <FlatList
          data={postList}
          renderItem={({ item }) => {
            return (
              <View style={styles.card}>
                <Text style={styles.titleText}>{item.headline}</Text>

                {item.text ? (
                  <HTML source={{ html: item.text }} contentWidth={width} />
                ) : (
                  <Text>No content available</Text>
                )}
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  titleText: {
    fontSize: 30,
  },
  bodyText: {
    fontSize: 24,
    color: "#666666",
  },
});
