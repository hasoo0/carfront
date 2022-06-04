import React, { Component } from "react";
import { SERVER_URL } from "../constants";

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCar from "./AddCar";
import EditCar from "./EditCar";

import { CSVLink } from "react-csv";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


class Carlist extends Component {
  constructor(props) {
    super(props);
    this.state = { arabalar: [] };
  }
  componentDidMount() {
    this.fetchCars();
  }
  // fetch Car
  fetchCars = () => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/car", { headers: { Authorization: token } })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          arabalar: responseData._embedded.car,
        });
      })
      .catch((err) => console.error(err));
  };
  // Delete car
  onDelClick = (link) => {
    if (window.confirm("Are you sure to delet?")) {
      const token = sessionStorage.getItem("jwt");
      fetch(link, { method: "DELETE", headers: { Authorization: token } })
        .then((res) => {
          toast.success("Car deleted", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          this.fetchCars();
        })
        .catch((err) => {
          toast.error("Error when deleting", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          console.error(err);
        });
    }
  };

  // Add new car
  addCar(car) {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/car", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(car),
    })
      .then((res) => this.fetchCars())
      .catch((err) => console.error(err));
  }

  // Update car
  updateCar(car, link) {
    const token = sessionStorage.getItem("jwt");
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(car),
    })
      .then((res) => {
        toast.success("Changes saved", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        this.fetchCars();
      })
      .catch((err) =>
        toast.error("Error when saving", {
          position: toast.POSITION.BOTTOM_LEFT,
        })
      );
  }

  //   // Logout
  //   handleLogout = () => {
  //   this.props.Logout();
  // };

  filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    const content = row[id];
    if (typeof content !== "undefined") {
      // filter by text in the table or if it's a object, filter by key
      if (typeof content === "object" && content !== null && content.key) {
        return String(content.key).replace('İ','i').replace('I','ı')
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      } else {
        return String(content).replace('İ','i').replace('I','ı')
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      }
    }

    return true;
  };

  render() {
    const columns = [
      {
        Header: "Brand",
        accessor: "brand",
      },
      {
        Header: "Model",
        accessor: "model",
      },
      {
        Header: "Color",
        accessor: "color",
      },
      {
        Header: "Year",
        accessor: "year",
      },
      {
        Header: "Kayit No",
        accessor: "registerNumber",
      },
      {
        Header: "Price €",
        accessor: "price",
      },
      {
        sortable: false,
        filterable: false,
        width: 100,
        accessor: "_links.self.href",
        Cell: ({ value, row }) => (
          <EditCar
            car={row}
            link={value}
            updateCar={this.updateCar}
            fetchCars={this.fetchCars}
          />
        ),
      },
      {
        id: "delbutton",
        sortable: false,
        filterable: false,
        width: 100,
        accessor: "_links.self.href",
        Cell: ({ value }) => (
          <IconButton size="small" onClick={() => {
              this.onDelClick(value);
            }}
          >
            <DeleteIcon color="error"/>
          </IconButton>
        ),
      },
    ];

    return (
      <div className="App">
        <Grid container>
          <Grid item>
            <AddCar addCar={this.addCar} fetchCars={this.fetchCars} />
          </Grid>
          <Grid item style={{ padding: 20 }}></Grid>
          <Grid item>
            <CSVLink data={this.state.arabalar} separator=";">
              Export CSV
            </CSVLink>
          </Grid>
          {/* <Grid item style={{textAlign:"right"}}>
          <Button variant="outlined" color="secondary" onClick={this.handleLogout}>logout</Button>
          </Grid> */}
        </Grid>

        <ReactTable
          data={this.state.arabalar}
          columns={columns}
          filterable={true}
          defaultFilterMethod={this.filterCaseInsensitive}
        />{" "}
        <ToastContainer autoClose={1500} />
      </div>
    );
  }
}
export default Carlist;
