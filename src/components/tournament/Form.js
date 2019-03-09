import React from "react";

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from "@material-ui/core";
// import { Link, Redirect } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import CategoryTable from "../table/Table";

const categoryColumns = [
  { id: "gender", numeric: false, disablePadding: false, label: "Пол" },
  { id: "minAge", numeric: false, disablePadding: false, label: "Лет от" },
  { id: "maxAge", numeric: false, disablePadding: false, label: "Лет до" },
  { id: "minWeight", numeric: false, disablePadding: false, label: "Вес от" },
  { id: "maxWeight", numeric: false, disablePadding: false, label: "Вес до" }
];

class Form extends React.Component {
  state = { id: "", name: "", date: "", address: "", categories: [] };

  componentDidMount() {
    const { id, name, date, address, categories } = this.props.data;
    console.log("this.props DidMount", this.props.data);
    this.setState({ id, name, date, address, categories });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSelect = selected => {
    this.setState({ categories: selected });
  };

  handleSubmit = () => {
    const { id, name, date, address, categories } = this.state;
    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    };
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "tournaments" },
        { name, date, address, categories, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error.message);
      });
    } else {
      console.log("update categories", categories);
      const firestoreUpdate = this.props
        .firestoreUpdate(
          { collection: "tournaments", doc: id },
          { id, name, date, address, categories, createdBy }
        )
        .then(result => console.log("result", result));
      firestoreUpdate.catch(error => {
        console.log("firestoreUpdate error", error.message);
      });
    }

    this.handleCancel();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { id, name, date, address, categories } = this.state;
    const { allCategories } = this.props;
    const formTitle = id ? "Редактирование" : "Добавление";
    // console.log("categories", categories);

    return (
      <Dialog
        open={this.props.isModalOpen}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Typography color="primary">{formTitle} турнира</Typography>
        </DialogTitle>
        <DialogContent>
          <form onChange={this.handleChange}>
            {/* NAME */}
            <TextField
              // onChange={this.handleChange}
              id="name"
              label="Название"
              type="text"
              value={name}
              margin="normal"
              autoFocus
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <br />
            {/* DATE+TIME */}
            <TextField
              // onChange={this.handleChange}
              id="date"
              label="Дата"
              type="datetime-local"
              value={date}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            {/* ADDRESS */}
            <TextField
              // onChange={this.handleChange}
              id="address"
              label="Адрес"
              type="text"
              value={address}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            {categories ? (
              <CategoryTable
                data={allCategories}
                // handleSelected={this.getSelected}
                openModal={this.openModal}
                /* firestoreDelete={() => {}} */
                columns={categoryColumns}
                collection="categories"
                title="Категории"
                selected={this.state.categories}
                handleSelect={this.handleSelect}
                // hideToolbar={true}
              />
            ) : (
              <CircularProgress />
            )}

            {/* <Button onClick={this.addCategory}>Add category</Button> */}
          </form>
          <br />
          <FormHelperText> {/*THIS IS PLACE FOR ERROR MESSAGE */}</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    allCategories: state.firestore.ordered.categories
  };
};

export default compose(
  firestoreConnect([{ collection: "tournaments" }, { collection: "categories" }]),
  connect(mapStateToProps)
)(Form);
