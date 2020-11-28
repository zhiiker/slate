import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as System from "~/components/system";
import * as Actions from "~/common/actions";
import * as SVG from "~/common/svg";
import * as Window from "~/common/window";
import * as UserBehaviors from "~/common/user-behaviors";

import { css } from "@emotion/core";
import { Boundary } from "~/components/system/components/fragments/Boundary";
import { PopoverNavigation } from "~/components/system/components/PopoverNavigation";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { dispatchCustomEvent } from "~/common/custom-events";
import { CheckBox } from "~/components/system/components/CheckBox";
import { Table } from "~/components/core/Table";
import { FileTypeIcon } from "~/components/core/FileTypeIcon";
import { ButtonPrimary, ButtonWarning } from "~/components/system/components/Buttons";
import { TabGroup } from "~/components/core/TabGroup";

import SlateMediaObjectPreview from "~/components/core/SlateMediaObjectPreview";
import FilePreviewBubble from "~/components/core/FilePreviewBubble";

const STYLES_CONTAINER_HOVER = css`
  display: flex;

  :hover {
    color: ${Constants.system.brand};
  }
`;

const STYLES_ICON_BOX = css`
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 16px;
`;

const STYLES_CANCEL_BOX = css`
  height: 16px;
  width: 16px;
  background-color: ${Constants.system.brand};
  border-radius: 3px;
  position: relative;
  right: 3px;
  cursor: pointer;
  box-shadow: 0 0 0 1px ${Constants.system.brand};
`;

const STYLES_HEADER_LINE = css`
  display: flex;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 30px;
`;

const STYLES_LINK = css`
  display: inline;
  cursor: pointer;
  transition: 200ms ease all;
  font-size: 0.9rem;
  padding: 12px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;

  @media (max-width: ${Constants.sizes.tablet}px) {
    max-width: 120px;
  }
`;

const STYLES_VALUE = css`
  font-size: 0.9rem;
  padding: 12px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const STYLES_ICON_BOX_HOVER = css`
  display: inline-flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;

  :hover {
    color: ${Constants.system.brand};
  }
`;

const STYLES_ICON_BOX_BACKGROUND = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 3px;
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

const STYLES_ACTION_BAR = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 0 1px ${Constants.system.lightBorder} inset,
    0 0 4px 2px ${Constants.system.shadow};
  border-radius: 4px;
  padding: 12px 32px;
  box-sizing: border-box;
  background-color: ${Constants.system.foreground};
  position: fixed;
  bottom: 12px;
  left: 10vw;
  width: 80vw;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const STYLES_LEFT = css`
  width: 100%;
  min-width: 10%;
  display: flex;
  align-items: center;
`;

const STYLES_FILES_SELECTED = css`
  font-family: ${Constants.font.semiBold};

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_COPY_INPUT = css`
  pointer-events: none;
  position: absolute;
  opacity: 0;
`;

const STYLES_IMAGE_GRID = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  width: 100%;

  @media (max-width: ${Constants.sizes.mobile}px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const STYLES_IMAGE_BOX = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 0px 1px ${Constants.system.lightBorder} inset,
    0 0 40px 0 ${Constants.system.shadow};
  cursor: pointer;
  position: relative;

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin: 12px auto;
  }
`;

const STYLES_MOBILE_HIDDEN = css`
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

export default class DataView extends React.Component {
  _mounted = false;

  state = {
    menu: null,
    loading: {},
    checked: {},
    view: "grid",
    viewLimit: 40,
    scrollDebounce: false,
    imageSize: 100,
  };

  async componentDidMount() {
    this.calculateWidth();
    this.debounceInstance = Window.debounce(this.calculateWidth, 200);
    if (!this._mounted) {
      this._mounted = true;
      window.addEventListener("scroll", this._handleCheckScroll);
      window.addEventListener("resize", this.debounceInstance);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener("scroll", this._handleCheckScroll);
    window.removeEventListener("resize", this.debounceInstance);
  }

  calculateWidth = () => {
    let windowWidth = window.innerWidth;
    let imageSize;
    if (windowWidth < Constants.sizes.mobile) {
      imageSize = (windowWidth - 2 * 24 - 20) / 2;
    } else {
      imageSize = (windowWidth - 2 * 56 - 4 * 20) / 5;
    }
    this.setState({ imageSize });
  };

  _handleScroll = (e) => {
    const windowHeight =
      "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 600) {
      this.setState({ viewLimit: this.state.viewLimit + 30 });
    }
  };

  _handleCheckScroll = Window.debounce(this._handleScroll, 200);

  _handleCheckBox = (e) => {
    let checked = this.state.checked;
    if (e.target.value === false) {
      delete checked[e.target.name];
      this.setState({ checked });
      return;
    }
    this.setState({
      checked: { ...this.state.checked, [e.target.name]: true },
    });
  };

  _handleDelete = async (cid) => {
    const message = `Are you sure you want to delete these files? They will be deleted from your slates as well`;
    if (!window.confirm(message)) {
      return;
    }

    let cids;
    if (cid) {
      cids = [cid];
    } else {
      cids = Object.keys(this.state.checked).map((id) => {
        let index = parseInt(id);
        let item = this.props.viewer.library[0].children[index];
        return item.cid;
      });
      this.setState({ checked: {} });
    }

    await this._handleLoading({ cids });
    await UserBehaviors.deleteFiles(cids, []);
    this._handleLoading({ cids });
  };

  _handleSelect = (index) => {
    System.dispatchCustomEvent({
      name: "slate-global-open-carousel",
      detail: { index },
    });
  };

  _handleCopy = (e, value) => {
    e.stopPropagation();
    this._handleHide();
    this.setState({ copyValue: value }, () => {
      this._ref.select();
      document.execCommand("copy");
    });
  };

  _handleHide = (e) => {
    this.setState({ menu: null });
  };

  _handleLoading = ({ cids }) => {
    let loading = this.state.loading;
    for (let cid of cids) {
      System.dispatchCustomEvent({
        name: "data-global-carousel-loading",
        detail: { loading: !this.state.loading[cid] },
      });
      loading[cid] = !this.state.loading[cid];
    }
    this.setState({ loading });
  };

  _handleClick = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleAddToSlate = (e) => {
    let userFiles = this.props.viewer.library[0].children;
    let files = Object.keys(this.state.checked).map((index) => userFiles[index]);
    this.props.onAction({
      type: "SIDEBAR",
      value: "SIDEBAR_ADD_FILE_TO_SLATE",
      data: { files },
    });
    this._handleUncheckAll();
  };

  _handleUncheckAll = () => {
    this.setState({ checked: {} });
  };

  render() {
    let numChecked = Object.keys(this.state.checked).length || 0;
    const header = (
      <div css={STYLES_HEADER_LINE}>
        <TabGroup disabled tabs={["Uploads"]} style={{ margin: 0 }} />
        <span css={STYLES_MOBILE_HIDDEN}>
          <div
            css={STYLES_ICON_BOX}
            onClick={() => {
              this.setState({ view: "grid", menu: null });
            }}
          >
            <SVG.GridView
              style={{
                color: this.state.view === "grid" ? Constants.system.black : "rgba(0,0,0,0.25)",
              }}
              height="24px"
            />
          </div>
        </span>
        <span css={STYLES_MOBILE_HIDDEN}>
          <div
            css={STYLES_ICON_BOX}
            onClick={() => {
              this.setState({ view: "list", menu: null });
            }}
          >
            <SVG.TableView
              style={{
                color: this.state.view === "list" ? Constants.system.black : "rgba(0,0,0,0.25)",
              }}
              height="24px"
            />
          </div>
        </span>
      </div>
    );
    const footer = (
      <React.Fragment>
        {numChecked ? (
          <div css={STYLES_ACTION_BAR}>
            <div css={STYLES_LEFT}>
              <span css={STYLES_FILES_SELECTED}>
                {numChecked} file{numChecked > 1 ? "s" : ""} selected
              </span>
            </div>
            <div css={STYLES_RIGHT}>
              <ButtonPrimary transparent onClick={this._handleAddToSlate}>
                Add to slate
              </ButtonPrimary>
              <ButtonWarning
                transparent
                style={{ marginLeft: 8 }}
                onClick={() => this._handleDelete()}
                loading={
                  this.state.loading &&
                  Object.values(this.state.loading).some((elem) => {
                    return !!elem;
                  })
                }
              >
                Delete files
              </ButtonWarning>
              <div css={STYLES_ICON_BOX} onClick={() => this.setState({ checked: {} })}>
                <SVG.Dismiss height="20px" style={{ color: Constants.system.darkGray }} />
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
    if (this.state.view === "grid") {
      return (
        <React.Fragment>
          {header}
          <div css={STYLES_IMAGE_GRID}>
            {this.props.items.slice(0, this.state.viewLimit).map((each, i) => {
              const cid = each.cid;
              return (
                <div
                  key={each.id}
                  css={STYLES_IMAGE_BOX}
                  style={{
                    width: this.state.imageSize,
                    height: this.state.imageSize,
                  }}
                  onClick={() => this._handleSelect(i)}
                  onMouseEnter={() => this.setState({ hover: i })}
                  onMouseLeave={() => this.setState({ hover: null })}
                >
                  <SlateMediaObjectPreview
                    blurhash={each.blurhash}
                    url={Strings.getCIDGatewayURL(each.cid)}
                    title={each.file || each.name}
                    type={each.type}
                    previewImage={each.previewImage}
                    dataView={true}
                  />
                  <span css={STYLES_MOBILE_HIDDEN}>
                    {numChecked || this.state.hover === i || this.state.menu === each.id ? (
                      <React.Fragment>
                        <div
                          css={STYLES_ICON_BOX_BACKGROUND}
                          onClick={
                            this.state.loading[cid]
                              ? () => {}
                              : (e) => {
                                  e.stopPropagation();
                                  this.setState({
                                    menu: this.state.menu === each.id ? null : each.id,
                                  });
                                }
                          }
                        >
                          {this.state.loading[cid] ? (
                            <LoaderSpinner style={{ height: 24, width: 24 }} />
                          ) : (
                            <SVG.MoreHorizontal height="24px" />
                          )}

                          {this.state.menu === each.id ? (
                            <Boundary
                              captureResize={true}
                              captureScroll={false}
                              enabled
                              onOutsideRectEvent={this._handleHide}
                            >
                              <PopoverNavigation
                                style={{
                                  top: "32px",
                                  right: "0px",
                                }}
                                navigation={[
                                  {
                                    text: "Copy CID",
                                    onClick: (e) => this._handleCopy(e, cid),
                                  },
                                  {
                                    text: "Copy link",
                                    onClick: (e) =>
                                      this._handleCopy(e, Strings.getCIDGatewayURL(cid)),
                                  },
                                  {
                                    text: "Delete",
                                    onClick: (e) => {
                                      e.stopPropagation();
                                      this.setState({ menu: null }, () => this._handleDelete(cid));
                                    },
                                  },
                                ]}
                              />
                            </Boundary>
                          ) : null}
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            let checked = this.state.checked;
                            if (checked[i]) {
                              delete checked[i];
                            } else {
                              checked[i] = true;
                            }
                            this.setState({ checked });
                          }}
                        >
                          <CheckBox
                            name={i}
                            value={!!this.state.checked[i]}
                            onChange={this._handleCheckBox}
                            boxStyle={{
                              height: 24,
                              width: 24,
                              backgroundColor: this.state.checked[i]
                                ? Constants.system.brand
                                : "rgba(255, 255, 255, 0.75)",
                            }}
                            style={{
                              position: "absolute",
                              bottom: 8,
                              left: 8,
                            }}
                          />
                        </div>
                      </React.Fragment>
                    ) : null}
                  </span>
                </div>
              );
            })}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                css={STYLES_IMAGE_BOX}
                style={{ boxShadow: "none", cursor: "default" }}
              />
            ))}
          </div>
          {footer}
          <input
            ref={(c) => {
              this._ref = c;
            }}
            readOnly
            value={this.state.copyValue}
            css={STYLES_COPY_INPUT}
          />
        </React.Fragment>
      );
    }

    const columns = [
      {
        key: "checkbox",
        name: numChecked ? (
          <div css={STYLES_CANCEL_BOX} onClick={() => this.setState({ checked: {} })}>
            <SVG.Minus height="16px" style={{ color: Constants.system.white }} />
          </div>
        ) : (
          <span />
        ),
        width: "24px",
      },
      {
        key: "name",
        name: <div style={{ fontSize: "0.9rem", padding: "18px 0" }}>Name</div>,
        width: "100%",
      },
      {
        key: "size",
        name: <div style={{ fontSize: "0.9rem", padding: "18px 0" }}>Size</div>,
        width: "104px",
      },
      {
        key: "more",
        name: <span />,
        width: "48px",
      },
    ];
    const rows = this.props.items.slice(0, this.state.viewLimit).map((each, index) => {
      const cid = each.cid;

      return {
        ...each,
        checkbox: (
          <CheckBox
            name={index}
            value={!!this.state.checked[index]}
            onChange={this._handleCheckBox}
            boxStyle={{ height: 16, width: 16 }}
            style={{
              position: "relative",
              right: 3,
              margin: "12px 0",
              opacity: numChecked > 0 || this.state.hover === index ? "100%" : "0%",
            }}
          />
        ),
        name: (
          <FilePreviewBubble url={cid} type={each.type}>
            <div css={STYLES_CONTAINER_HOVER} onClick={() => this._handleSelect(index)}>
              <div css={STYLES_ICON_BOX_HOVER} style={{ paddingLeft: 0, paddingRight: 18 }}>
                <FileTypeIcon type={each.type} height="24px" />
              </div>
              <div css={STYLES_LINK}>{each.file || each.name}</div>
            </div>
          </FilePreviewBubble>
        ),
        size: <div css={STYLES_VALUE}>{Strings.bytesToSize(each.size)}</div>,
        more: (
          <div
            css={STYLES_ICON_BOX_HOVER}
            onClick={
              this.state.loading[cid]
                ? () => {}
                : () =>
                    this.setState({
                      menu: this.state.menu === each.id ? null : each.id,
                    })
            }
          >
            {this.state.loading[cid] ? (
              <LoaderSpinner style={{ height: 24, width: 24 }} />
            ) : (
              <SVG.MoreHorizontal height="24px" />
            )}

            {this.state.menu === each.id ? (
              <Boundary
                captureResize={true}
                captureScroll={false}
                enabled
                onOutsideRectEvent={this._handleHide}
              >
                <PopoverNavigation
                  style={{
                    top: "48px",
                    right: "40px",
                  }}
                  navigation={[
                    {
                      text: "Copy CID",
                      onClick: (e) => this._handleCopy(e, cid),
                    },
                    {
                      text: "Copy link",
                      onClick: (e) => this._handleCopy(e, Strings.getCIDGatewayURL(cid)),
                    },
                    {
                      text: "Delete",
                      onClick: (e) => {
                        e.stopPropagation();
                        this.setState({ menu: null }, () => this._handleDelete(cid));
                      },
                    },
                  ]}
                />
              </Boundary>
            ) : null}
          </div>
        ),
      };
    });

    const data = {
      columns,
      rows,
    };

    return (
      <React.Fragment>
        {header}
        <Table
          data={data}
          rowStyle={{ padding: "10px 16px" }}
          topRowStyle={{ padding: "0px 16px" }}
          onMouseEnter={(i) => this.setState({ hover: i })}
          onMouseLeave={() => this.setState({ hover: null })}
        />
        {footer}
        <input
          ref={(c) => {
            this._ref = c;
          }}
          readOnly
          value={this.state.copyValue}
          css={STYLES_COPY_INPUT}
        />
      </React.Fragment>
    );
  }
}
