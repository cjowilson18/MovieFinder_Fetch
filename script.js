class MovieFinder extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        searchTerm: '',
        results: [],
        error: '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
      this.setState({ searchTerm: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        let { searchTerm } = this.state;
        searchTerm = searchTerm.trim();  // gets rid of spacing
        if (!searchTerm) {  // make sure the value isn't an empty string
          return;  // early return if empty string
        }
        // make the AJAX request to OMDBAPI
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=b7da8d63`)
        .then(checkStatus)
        .then(json).then((data) => {
            if (data.Response === 'False') {
                throw new Error(data.Error);
            }

            if (data.Response === 'True' && data.Search) {
                this.setState({ results: data.Search, error: ''});// Stores the arrap of movie objects in component state
            }
        }).catch((error) => {
            this.setState({error: error.message });
          console.log(error);
        })
      }
    render() {
      const { searchTerm, results } = this.state;  // ES6 destructuring
      return (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <form onSubmit={this.handleSubmit} className="form-inline my-4">
                <input
                  type="text"
                  className="form-control mr-sm-2"
                  placeholder="Movie Name"
                  value={searchTerm}
                  onChange={this.handleChange}
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>
              {(() => {
                if (error) {
                    return error;
                }

                return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;  // returns poster forst column and info second column
              })
            })()}
            </div>
          </div>
        </div>
      )
    }
  }

  const Movie = (props) => {
    const {Title, Year, imdbID, Type, Poster } = props.movie;

    return (
        <div className='row'>
            <div className='col-4 col-md-3 mb-3'>
                <a href={'https://www.imdb.com/title/${imdbID}/'} target= '_blank'>
                    <h4> {Title} </h4>
                    <p> {Type} | {Year} </p>
                </a>
            </div>
        </div>
    )
  }
  
  const checkStatus = (response) => {
    if (response.ok) {
        return response;
    }
    throw new Error('Request was either 404 or 500');
  }

  const json = (response) => response.json()

  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(<MovieFinder />);