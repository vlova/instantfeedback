require.config({
  baseUrl: '/externs/bower_components',
  paths: {
    'react': 'react/react-with-addons',
    'react-dom': 'react-dom/react-dom',
    'state-manager': '/common/state'
  },
  enforceDefine: false
});

require(
  ['react', 'react-dom', 'state-manager'],
  function (React, d, store) {
    d.el = React.createElement;

    var pageData = {
      comments: [{
        id: 1,
        author: 'Vasiliy Pupkin',
        when: new Date('12/26/2014'),
        text: 'this is my superios comment',
        votes: 10
      }, {
        id: 2,
        author: 'Vasiliy Pupkin Stanislavovich',
        when: new Date('12/26/2014 2:10:10'),
        text: 'this is my another superious comment',
        comments: [{
          id: 3,
          author: 'Admin',
          when: new Date('12/26/2014 2:40:20'),
          text: 'bla-bla'
        }]
      }],
      level: 0
    };

    window.pageDataUpdatedEvent = function (data) { };

    var AsyncButton = React.createClass({
      getInitialState: function() {
        return {
          disabled: this.props.disabled || false
        };
      },

      click: function() {
        this.setState({
          disabled: true
        });
        this.props.click(this.completed);
      },

      completed: function() {
        this.setState({
          disabled: this.props.disabled || false
        });
      },

      render: function() {
        var attrs = {
          type: 'button',
          onClick: this.click,
          value: this.props.value
        };

        if (this.state.disabled) {
          attrs.disabled = 'disabled';
        }

        return d.input(attrs, []);
      }
    });

    var VoteBox = React.createClass({
      getInitialState: function() {
        return {
          votes: this.props.votes || 0,
          blocked: false
        };
      },

      increment: function(callback) {
        setTimeout(function() {
          this.setState({ votes: this.state.votes + 1});
          store.set('votes[' + this.props.id + ']', this.state.votes);
          callback();
        }.bind(this), 1000);
      },

      decrement: function(callback) {
        setTimeout(function() {
          this.setState({ votes: this.state.votes - 1});
          store.set('votes[' + this.props.id + ']', this.state.votes);
          callback();
        }.bind(this), 1000);
      },

      render: function() {
        return d.span([
          d.el(AsyncButton, {value: '+', click: this.increment}),
          ' ',
          this.state.votes,
          ' ',
          d.el(AsyncButton, {value: '-', click: this.decrement})]);
      }
    });

    var AnswerForm = React.createClass({
      getInitialState: function() {
        return { valid: true };
      },

      submitAnswer: function(e) {
        e.preventDefault();

        var text = this.refs.text.getDOMNode().value;

        var state = this.state;
        state.valid = !!text;
        this.setState(state);

        pageData.comments.push({
          id: 6,
          author: 'Vasiliy Pupkin',
          when: new Date(),
          text: text,
          votes: 10
        });

        pageDataUpdatedEvent(pageData);
      },

      render: function() {
        if (!this.props.visible) {
          return null;
        }

        return d.form({ onSubmit : this.submitAnswer }, [
          d.br(),
          d.textarea({ ref: 'text' }, null),
          d.br(),
          this.state.valid ?
            null
            : ['Введите сообщение, блин!', d.br()],
          d.input({ type:'submit', value: 'Answer to comment' }, [])
        ]);
      }
    });

    var Comment = React.createClass({
      getInitialState: function() {
        return {
          elapsed: new Date().getTime() - this.props.when.getTime(),
          answerForm: false
        };
      },

      tick: function() {
        this.setState({elapsed: this.state.elapsed + 1});
      },

      componentDidMount: function() {
        this.interval = setInterval(this. tick, 1000);
      },

      componentWillUnmount: function() {
        clearInterval(this.interval);
      },

      renderAnswer: function() {
        var state = this.state;
        state.answerForm = !state.answerForm;
        this.setState(state);
      },

      render: function() {
        return d.div({class: 'comment comment-' + this.props.level}, [
          d.span(
            {class: 'text'},
            [
              d.br(),
              this.props.text
            ]),
          d.br(),
          d.span([
            d.el(VoteBox, { votes: this.props.votes }),
            ' | ',
            d.a({ href: '#', onClick: this.renderAnswer }, 'Answer'),
            ' | ',
            d.span({class: 'elapsed'},
                   this.state.elapsed + ' seconds elapsed'),
            ' | ',
            d.span({class: 'author'}, [
              d.strong('Author: '), this.props.author])]),
          d.el(AnswerForm, { visible: this.state.answerForm }),
          d.el(CommentList, { data: this.props })
        ]);
      }
    });

    var CommentList = React.createClass({
      getInitialState: function() {
        return this.props.data;
      },

      componentDidMount: function() {
        if (this.props.data.level === 0) {
          window.pageDataUpdatedEvent = this.dataUpdated;
        }
      },

      componentWillUnmount: function() {
        if (this.props.data.level === 0) {
          window.pageDataUpdatedEvent = function(data) { };
        }
      },

      dataUpdated: function(data) {
        this.setState(data);
      },

      render: function() {
        var comments = [];
        for (var commentId in this.state.comments) {
          var comment = this.state.comments[commentId];
          comment.level = (this.state.level + 1) || 0;
          comments.push(d.el(Comment, comment));
        }

        return d.div(comments);
      }
    });

    React.render(d.el(CommentList, { data: pageData }), document.getElementById('content'));
  });
