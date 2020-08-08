import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/components/system/svg";
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
  width: 100%;
  border-radius: 4px;
  background-color: ${Constants.system.white};
  border: 1px solid ${Constants.system.border};
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px ${Constants.system.darkGray};
`;

const STYLES_DROPDOWN_ITEM = css`
  box-sizing: border-box;
  padding: 8px 24px;
  font-size: 0.8em;
  cursor: pointer;
`;

export class InputMenu extends React.Component {
  _optionRoot;

  static defaultProps = {
    show: false,
  };

  state = {
    show: this.props.show,
    selectedIndex: 0,
  };

  componentDidMount = () => {
    window.addEventListener("keydown", this._handleDocumentKeydown);
  };

  componentWillUnmount = () => {
    window.removeEventListener("keydown", this._handleDocumentKeydown);
  };

  _handleDelete = (e) => {
    if (!this.props.value) {
      this.props.onInputChange({
        target: {
          value: "",
          name: this.props.name,
        },
      });
    }
    this.setState({ show: false });
  };

  _handleInputChange = (e) => {
    if (this.state.selectedIndex !== 0) {
      console.log("set to zero");
      this.setState({ selectedIndex: 0 });
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
    this.setState({ show: false });
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
      //down -- this one errors
      if (this.state.selectedIndex < this.props.options.length - 1) {
        let listElem = this._optionRoot.children[this.state.selectedIndex + 1];
        let bottomPos = listElem.offsetBottom;
        if (bottomPos > this._optionRoot.offsetBottom) {
          console.log("offset");
          this._optionRoot.scrollTop =
            bottomPos - this._optionRoot.offsetHeight;
        }
        this.setState({ selectedIndex: this.state.selectedIndex + 1 });
      }
    } else if (e.keyCode === 38) {
      //up -- this one works, but add in something that ignores the "on mouse enter" for the case where it moves by jumping this way
      if (this.state.selectedIndex > 0) {
        let listElem = this._optionRoot.children[this.state.selectedIndex - 1];
        let topPos = listElem.offsetTop;
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
    console.log(this._optionRoot);
    return (
      <div
        css={STYLES_DROPDOWN_CONTAINER}
        style={{
          maxWidth: this.props.full ? "none" : "480px",
          ...this.props.containerStyle,
        }}
      >
        <Boundary
          enabled
          onOutsideRectEvent={this._handleDelete}
          isDataMenuCaptured={true}
        >
          <Input
            full
            placeholder={this.props.placeholder}
            value={this.props.inputValue}
            onChange={this._handleInputChange}
            onFocus={() => this.setState({ show: true })}
            noOutline
          />
          {this.state.show &&
          this.props.options &&
          this.props.options.length > 0 ? (
            <div
              data-menu
              ref={(c) => {
                this._optionRoot = c;
              }}
              css={STYLES_DROPDOWN}
              style={{
                maxWidth: this.props.full ? "none" : "480px",
                ...this.props.style,
              }}
            >
              {this.props.options.map((each, i) => (
                <div
                  key={each.value}
                  css={STYLES_DROPDOWN_ITEM}
                  style={{
                    backgroundColor:
                      this.state.selectedIndex === i
                        ? Constants.system.gray
                        : Constants.system.white,
                    borderBottom: this.props.search
                      ? this.state.selectedIndex === i + 1
                        ? `1px solid ${Constants.system.white}`
                        : `1px solid ${Constants.system.gray}`
                      : "none",
                    borderRadius:
                      this.props.search && this.state.selectedIndex === i
                        ? "4px"
                        : "0px",
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
        </Boundary>
      </div>
    );
  }
}
