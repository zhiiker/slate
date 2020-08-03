import * as React from "react";
import * as System from "~/components/system";
import * as Constants from "~/common/constants";

import Group from "~/components/system/Group";
import SystemPage from "~/components/system/SystemPage";
import ViewSourceLink from "~/components/system/ViewSourceLink";
import CodeBlock from "~/components/system/CodeBlock";

const SELECT_MENU_OPTIONS = [
  { value: "1", name: "Capricorn" },
  { value: "2", name: "Aquarius" },
  { value: "3", name: "Pisces" },
  { value: "4", name: "Aries" },
  { value: "5", name: "Taurus" },
  { value: "6", name: "Gemini" },
  { value: "7", name: "Cancer" },
  { value: "8", name: "Leo" },
  { value: "9", name: "Virgo" },
  { value: "10", name: "Libra" },
  { value: "11", name: "Scorpio" },
  { value: "12", name: "Sagittarus" },
];

export default class SystemPageDropdowns extends React.Component {
  state = {
    exampleOne: "1",
    exampleTwo: "3",
    exampleThree: "",
    exampleFour: "United States of America",
    inputValue: "",
    options: SELECT_MENU_OPTIONS,
  };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleInputChange = (e) => {
    let query = e.target.value.toLowerCase();
    let newItems = [];
    for (let item of SELECT_MENU_OPTIONS) {
      if (item.name.toLowerCase().includes(query)) {
        newItems.push(item);
      }
    }
    this.setState({ inputValue: e.target.value, options: newItems });
  };

  render() {
    return (
      <SystemPage
        title="SDS: Dropdowns"
        description="..."
        url="https://slate.host/_/system/dropdowns"
      >
        <System.H1>
          Dropdowns <ViewSourceLink file="system/dropdowns.js" />
        </System.H1>
        <br />
        <br />
        <System.P>
          The Dropdown component is used to present the user a list of values
          where they can select a single option.
        </System.P>
        <br />
        <br />
        <br />
        <System.H2>Imports</System.H2>
        <hr />
        <br />
        <System.P>
          Import React and the <System.CodeText>SelectMenu</System.CodeText>,{" "}
          <System.CodeText>InputMenu</System.CodeText> and/or the{" "}
          <System.CodeText>SelectCountryMenu</System.CodeText> Components.
        </System.P>
        <br />
        <br />
        <CodeBlock>
          {`import * as React from "react";
import { SelectMenu, InputMenu, SelectCountryMenu } from "slate-react-system";`}
        </CodeBlock>
        <br />
        <br />
        <System.H2>Dropdown</System.H2>
        <hr />
        <br />
        <System.SelectMenu
          label="Pick a horoscope"
          name="exampleOne"
          value={this.state.exampleOne}
          category="horoscope"
          onChange={this._handleChange}
          options={SELECT_MENU_OPTIONS}
        />
        <br />
        <br />
        <System.SelectMenu
          label="Pick a horoscope (full length)"
          name="exampleTwo"
          full
          value={this.state.exampleTwo}
          category="horoscope"
          onChange={this._handleChange}
          options={SELECT_MENU_OPTIONS}
        />
        <br />
        <br />
        <System.P>
          Define the dropdown menu options. Each entry must have a name and a
          value.
        </System.P>
        <br />
        <CodeBlock>
          {`const SELECT_MENU_OPTIONS = [
  { value: "1", name: "Capricorn" },
  { value: "2", name: "Aquarius" },
  { value: "3", name: "Pisces" },
  { value: "4", name: "Aries" },
  { value: "5", name: "Taurus" },
  { value: "6", name: "Gemini" },
  { value: "7", name: "Cancer" },
  { value: "8", name: "Leo" },
  { value: "9", name: "Virgo" },
  { value: "10", name: "Libra" },
  { value: "11", name: "Scorpio" },
  { value: "12", name: "Sagittarus" },
];`}
        </CodeBlock>
        <br />
        <System.P>
          Declare the Dropdown component. Default values can be assigned using{" "}
          <System.CodeText>value</System.CodeText>.
        </System.P>
        <br />
        <CodeBlock>
          {`class ExampleOne extends React.Component {
  state = { exampleOne: "1" };

  _handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <SelectMenu
        label="Pick a horoscope"
        name="exampleOne"
        value={this.state.exampleOne}
        category="horoscope"
        onChange={this._handleChange}
        options={SELECT_MENU_OPTIONS}
      />
    );
  }
}

class ExampleTwo extends React.Component {
  state = { exampleTwo: "3" };

  _handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <SelectMenu
        label="Pick a horoscope (full length)"
        name="exampleTwo"
        full
        value={this.state.exampleTwo}
        category="horoscope"
        onChange={this._handleChange}
        options={SELECT_MENU_OPTIONS}
      />
    );
  }
}`}
        </CodeBlock>
        <br />
        <br />
        <br />
        <System.H2>Dropdown with Input</System.H2>
        <hr />
        <br />
        <System.InputMenu
          name="exampleThree"
          options={this.state.options}
          onChange={this._handleChange}
          value={this.state.exampleThree}
          onInputChange={this._handleInputChange}
          inputValue={this.state.inputValue}
        />
        <br />
        <br />
        <System.P>
          Declare an dropdown with input. This component allows users to filter
          a long list of values by typing.
        </System.P>
        <br />
        <System.P>
          Note that there are both <System.CodeText>onChange</System.CodeText> &{" "}
          <System.CodeText>value</System.CodeText>, as well as{" "}
          <System.CodeText>onInputChange</System.CodeText> &{" "}
          <System.CodeText>inputValue</System.CodeText>. The first two apply to
          the final returned value, and the latter two apply to the user's typed
          input.
        </System.P>
        <br />
        <System.P>
          <System.CodeText>onInputChange</System.CodeText> should be a function
          that both updates <System.CodeText>inputValue</System.CodeText> and
          filters <System.CodeText>options</System.CodeText> based on the user's{" "}
          <System.CodeText>inputValue</System.CodeText>.
        </System.P>
        <br />
        <CodeBlock>
          {`class ExampleThree extends React.Component {
  state = { exampleThree: "", inputValue: "", options: SELECT_MENU_OPTIONS };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleInputChange = (e) => {
    let query = e.target.value.toLowerCase();
    let newItems = [];
    for (let item of SELECT_MENU_OPTIONS) {
      if (item.name.toLowerCase().includes(query)) {
        newItems.push(item);
      }
    }
    this.setState({ inputValue: e.target.value, options: newItems });
  };

  render() {
    return (
      <InputMenu
        name="exampleThree"
        options={this.state.options}
        onChange={this._handleChange}
        value={this.state.exampleThree}
        onInputChange={this._handleInputChange}
        inputValue={this.state.inputValue}
      />
    );
  }
}`}
        </CodeBlock>
        <br />
        <br />
        <br />
        <System.H2>Country Picker Dropdown</System.H2>
        <hr />
        <br />
        <System.SelectCountryMenu
          label="Pick your country"
          name="exampleFour"
          full
          value={this.state.exampleFour}
          category="country"
          onChange={this._handleChange}
        />
        <br />
        <br />
        <br />
        <System.P>
          Declare a dropdown to select from a list of countries.
        </System.P>
        <br />
        <CodeBlock>
          {`class ExampleFour extends React.Component {
  state = { exampleFour: "United States of America" };

  _handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <SelectCountryMenu
        label="Pick your country"
        name="exampleFour"
        full
        value={this.state.exampleFour}
        category="country"
        onChange={this._handleChange}
      />
    );
  }
}`}
        </CodeBlock>
        <br />
        <br />
        <br />
        <System.H2>Accepted React Properties</System.H2>
        <hr />
        <br />
        <Group title="Dropdowns">
          <System.Table
            data={{
              columns: [
                { key: "a", name: "Name", width: "128px" },
                { key: "b", name: "Type", width: "88px", type: "OBJECT_TYPE" },
                { key: "c", name: "Default", width: "88px" },
                { key: "d", name: "Description", width: "100%" },
              ],
              rows: [
                {
                  id: 1,
                  a: (
                    <span style={{ fontFamily: Constants.font.semiBold }}>
                      options
                    </span>
                  ),
                  b: "Array",
                  c: "[]",
                  d:
                    "Array of options to select from. Each object in the array should have a name and value",
                },
                {
                  id: 2,
                  a: (
                    <span style={{ fontFamily: Constants.font.semiBold }}>
                      onChange
                    </span>
                  ),
                  b: "function",
                  c: "null",
                  d:
                    "Function called upon an onChange event. For an input dropdown, this is when the selected value changes",
                },
                {
                  id: 3,
                  a: (
                    <span style={{ fontFamily: Constants.font.semiBold }}>
                      value
                    </span>
                  ),
                  b: "string",
                  c: "null",
                  d:
                    "The value that the dropdown takes. Can be used to assign default values as well.",
                },
                {
                  id: 4,
                  a: (
                    <span style={{ fontFamily: Constants.font.semiBold }}>
                      onInputChange
                    </span>
                  ),
                  b: "function",
                  c: "null",
                  d: (
                    <span>
                      <span style={{ fontFamily: Constants.font.semiBold }}>
                        Only applicable to input dropdown.{" "}
                      </span>
                      <span>
                        Function called when the user-inputted value changes
                      </span>
                    </span>
                  ),
                },
                {
                  id: 5,
                  a: (
                    <span style={{ fontFamily: Constants.font.semiBold }}>
                      inputValue
                    </span>
                  ),
                  b: "string",
                  c: "null",
                  d: (
                    <span>
                      <span style={{ fontFamily: Constants.font.semiBold }}>
                        Only applicable to input dropdown.{" "}
                      </span>
                      <span>The value that the user-inputted value takes.</span>
                    </span>
                  ),
                },
                {
                  id: 6,
                  a: "name",
                  b: "string",
                  c: "null",
                  d: "Dropdown name",
                },
                {
                  id: 7,
                  a: "label",
                  b: "string",
                  c: "null",
                  d: "Label text",
                },
                {
                  id: 8,
                  a: "description",
                  b: "string",
                  c: "null",
                  d: "Description text",
                },
                {
                  id: 9,
                  a: "tooltip",
                  b: "string",
                  c: "null",
                  d: "Tooltip text",
                },
                {
                  id: 10,
                  a: "full",
                  b: "boolean",
                  c: "false",
                  d: "If true, no max-width. Otherwise, max-width is 480px",
                },
                {
                  id: 11,
                  a: "category",
                  b: "string",
                  c: "null",
                  d:
                    "Category text that appears to the right of the selected value",
                },
              ],
            }}
          />
        </Group>
      </SystemPage>
    );
  }
}
