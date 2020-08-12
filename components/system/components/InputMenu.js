import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";
import { Boundary } from "~/components/system/components/fragments/Boundary";
import { Input } from "~/components/system/components/Input";

const STYLES_DROPDOWN_CONTAINER = css`
  box-sizing: border-box;
  z-index: ${Constants.zindex.modal};
`;

const STYLES_DROPDOWN = css`
  box-sizing: border-box;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: ${Constants.system.white};
  overflow: hidden;
  width: 100%;
  border-radius: 12px 12px 0px 0px;
`;

const STYLES_DROPDOWN_ITEM = css`
  box-sizing: border-box;
  padding: 8px 24px;
  font-size: 0.8em;
  cursor: pointer;
`;

const STYLES_INPUT = css`
  font-family: ${Constants.font.text};
  -webkit-appearance: none;
  width: 100%;
  height: 40px;
  background: ${Constants.system.foreground};
  color: ${Constants.system.black};
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: flex-start;
  outline: 0;
  border: 0;
  box-sizing: border-box;
  transition: 200ms ease all;
  padding: 0 24px 0 48px;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 12px;
  margin-bottom: 16px;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${Constants.system.black};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${Constants.system.black};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${Constants.system.black};
  }
`;

export class InputMenu extends React.Component {
  _optionRoot;

  state = {
    selectedIndex: -1,
  };

  componentDidMount = () => {
    window.addEventListener("keydown", this._handleDocumentKeydown);
  };

  componentWillUnmount = () => {
    window.removeEventListener("keydown", this._handleDocumentKeydown);
  };

  _handleInputChange = (e) => {
    if (this.state.selectedIndex !== -1) {
      this.setState({ selectedIndex: -1 });
    }
    this.props.onChange({
      target: {
        value: null,
        name: this.props.name,
      },
    });
    this.props.onInputChange(e);
  };

  _handleSelect = (index) => {
    this.props.onChange({
      target: {
        value: this.props.options[index].value,
        name: this.props.name,
      },
    });
    this.props.onInputChange({
      target: {
        value: this.props.options[index].name,
        name: this.props.name,
      },
    });
  };

  _handleDocumentKeydown = (e) => {
    if (e.keyCode === 27) {
      this._handleDelete();
      e.preventDefault();
    } else if (e.keyCode === 9) {
      this._handleDelete();
    } else if (e.keyCode === 40) {
      //down -- this one doesn't jump properly
      if (this.state.selectedIndex < this.props.options.length - 1) {
        let listElem = this._optionRoot.children[
          this.state.selectedIndex + 1
        ].getBoundingClientRect();
        console.log(this._optionRoot.getBoundingClientRect());
        console.log(listElem);
        return;
        let bottomPos = listElem.offsetTop + listElem.offsetHeight;
        console.log(listElem.offsetTop);
        if (
          bottomPos >
          this._optionRoot.offsetTop + this._optionRoot.offsetHeight
        ) {
          this._optionRoot.scrollTop =
            bottomPos - this._optionRoot.offsetHeight;
        }
        this.setState({ selectedIndex: this.state.selectedIndex + 1 });
      }
      e.preventDefault();
    } else if (e.keyCode === 38) {
      //up -- this one works, but add in something that ignores the "on mouse enter" for the case where it moves by jumping this way
      if (this.state.selectedIndex > 0) {
        let listElem = this._optionRoot.children[
          this.state.selectedIndex - 1
        ].getBoundingClientRect();
        console.log(this._optionRoot.getBoundingClientRect());
        console.log(listElem);
        return;
        let topPos = listElem.offsetTop;
        console.log(this._optionRoot);
        console.log(topPos);
        console.log(this._optionRoot.offsetTop);
        if (topPos < this._optionRoot.offsetTop) {
          console.log("offset");
          this._optionRoot.scrollTop = topPos;
        }
        this.setState({ selectedIndex: this.state.selectedIndex - 1 });
      }
      e.preventDefault();
    } else if (e.keyCode === 13) {
      if (this.props.options.length > this.state.selectedIndex) {
        this._handleSelect(this.state.selectedIndex);
      }
      e.preventDefault();
    }
  };

  render() {
    return (
      <div css={STYLES_DROPDOWN_CONTAINER} style={this.props.containerStyle}>
        <div style={{ position: "relative" }}>
          <input
            css={STYLES_INPUT}
            value={this.props.inputValue}
            placeholder={this.props.placeholder}
            style={this.props.inputStyle}
            onChange={this._handleInputChange}
          />
          <SVG.Search
            height="20px"
            style={{ position: "absolute", left: "12px", top: "10px" }}
          />
        </div>
        {this.props.options && this.props.options.length > 0 ? (
          <div
            data-menu
            ref={(c) => {
              this._optionRoot = c;
            }}
            css={STYLES_DROPDOWN}
            style={this.props.style}
          >
            {this.props.options.map((each, i) => (
              <div
                key={each.value}
                css={STYLES_DROPDOWN_ITEM}
                style={{
                  backgroundColor:
                    this.state.selectedIndex === i
                      ? Constants.system.foreground
                      : Constants.system.white,
                  borderRadius: "12px",
                  ...this.props.itemStyle,
                }}
                onClick={() => {
                  this._handleSelect(i);
                }}
                onMouseEnter={() => {
                  this.setState({ selectedIndex: i });
                }}
              >
                {each.name}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
