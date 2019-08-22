import React, { Component } from 'react';
import { FilePond, File, registerPlugin } from 'react-filepond';
import SQL from 'sql.js';
import 'filepond/dist/filepond.min.css';
import './App.css';

import Word from './components/Word';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      words: { values: [] },
      // files: ['vocab.db'],
    };
  }

  componentDidMount() {
    const arrayAsString = localStorage.getItem('vocab');
    if (arrayAsString) {
      const arrayBuffer = new Uint8Array(arrayAsString.split(','));
      this.db = new SQL.Database(arrayBuffer);
      console.log(`this.db`, this.db);
      // const words = this.db.exec('SELECT word, stem FROM words;')[0];
      const words = this.db.exec(
        `SELECT word, stem, usage
         FROM words w
         INNER JOIN lookups l
         ON w.id = l.word_key;`
      )[0];

      console.log(`words`, words);
      this.setState({ words });
    }
  }

  onaddfile = e => {
    console.log(`e`, e);
    console.log(`this.pond`, this.pond);
    console.log(`this.pond.getFiles()`, this.pond.getFiles());

    const file = this.pond.getFiles()[0].file;
    const reader = new FileReader();
    reader.onload = () => {
      const arr = new Uint8Array(reader.result);
      try {
        localStorage.setItem('vocab', arr);
        this.db = new SQL.Database(arr);
        console.log(`db`, this.db);
        const words = this.db.exec('SELECT * FROM words;');
        console.log(`words`, words);
      } catch (e) {
        console.log(`e`, e);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  render() {
    return (
      <div className="App">
        <FilePond ref={ref => (this.pond = ref)} onaddfile={this.onaddfile}>
          {this.state.files.map(file => <File key={file} source={file} />)}
        </FilePond>
        <ul>
          {this.state.words.values.map(arr => (
            <Word key={arr[0]} word={arr[0]} usage={arr[2]} />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
