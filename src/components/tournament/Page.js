import React, { Component } from "react";
import { Fab, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Table from "../table/Table";
import Form from "./Form";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";

//Table columns or fields of our data model
const columns = [
  { id: "name", numeric: false, disablePadding: true, label: "Название" },
  { id: "date", numeric: false, disablePadding: true, label: "Время" },
  { id: "address", numeric: false, disablePadding: true, label: "Место" }
];

export class Page extends Component {
  state = { isModalOpen: false, data: {} };

  openModal = id => {
    //const defaultCategory = { gender: "", minAge: 0, maxAge: 0, minWeight: 0, maxWeight: 0 };
    const defaultData = { name: "", date: "", address: "", categories: [] };
    const modalData = this.props.tournaments.find(el => el.id === id) || defaultData;
    this.setState({ modalData });
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const { tournaments, categories } = this.props;
    const {
      add: firestoreAdd,
      delete: firestoreDelete,
      update: firestoreUpdate
    } = this.props.firestore;

    return (
      <main>
        {isLoaded(tournaments) && isLoaded(categories) ? (
          <Table
            data={tournaments}
            // handleSelected={this.getSelected}
            openModal={this.openModal}
            firestoreDelete={firestoreDelete}
            columns={columns}
            collection="tournaments"
            title="Турниры"
          />
        ) : (
          <CircularProgress />
        )}
        <Fab style={fabStyle} onClick={() => this.openModal(null)} color="primary" aria-label="Add">
          <AddIcon />
        </Fab>
        {this.state.isModalOpen && (
          <Form
            isModalOpen={this.state.isModalOpen}
            data={this.state.modalData}
            closeModal={this.closeModal}
            firestoreAdd={firestoreAdd}
            firestoreUpdate={firestoreUpdate}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    tournaments: state.firestore.ordered.tournaments,
    categories: state.firestore.ordered.categories
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "tournaments" }, { collection: "categories" }])
)(Page);

const fabStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed"
};
