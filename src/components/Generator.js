import React from 'react';
import Axios from 'axios';
import { Button, Container, Row, Col, Card, Image, Spinner } from 'react-bootstrap';

class Generator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meme: {},
            previousMeme: {},
            loading: true,
            haveLike: false
        }
        this.getMeme = this.getMeme.bind(this);
        this.getPreviousMeme = this.getPreviousMeme.bind(this);
        this.loadingHandler = this.loadingHandler.bind(this);
        this.like = this.like.bind(this);
    }

    componentDidMount() {
        this.getMeme();
    }

    getMeme() {
        this.setState({loading: true});
        let number = Math.floor(Math.random() * 400);
        Axios.get(`http://alpha-meme-maker.herokuapp.com/memes/${number}`)
        .then(res => {
            if (res.data.code === 404) {
                this.getMeme();
                this.setState({loading: true})
            }
            else {
                this.setState({
                    meme: res.data.data
                })
            }
            this.checkImage(this.state.meme.image);
        })
        .catch(err => {
            this.setState({loading: true})
        })
    }

    like() {
        this.setState({
            previousMeme: this.state.meme,
            haveLike: true
        })
    }

    getPreviousMeme() {
        this.setState({
            meme: this.state.previousMeme
        });
    }

    checkImage(image) {
        Axios.get(image)
        .then(res => {
            this.loadingHandler();
        })
        .catch(err => {
            this.getMeme();
        })
    }

    loadingHandler() {
        setTimeout(() => this.setState({loading: false}), 2000)
    }



    render() {
        return (
            <div>
                <Container className={this.state.loading ? 'hide' : ''} fluid>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <h2>{this.state.meme.topText}</h2>
                                    <Image src={this.state.meme.image} />
                                    <h2>{this.state.meme.bottomText}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <Button onClick={this.getPreviousMeme} className={this.state.haveLike ? '' : 'hide'} size='lg'>Liked one</Button>
                        </Col>
                        <Col xs={4}>
                            <Button onClick={this.getMeme} size='lg'>Generate</Button>
                        </Col>
                        <Col xs={4}>
                            <Button onClick={this.like} className='like-btn' size='lg'>Like</Button>
                        </Col>
                    </Row>
                </Container>
                <Container className={this.state.loading ? '' : 'hide'} fluid>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Container>
            </div>
        );
    }
}

export default Generator;