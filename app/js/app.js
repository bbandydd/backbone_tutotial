// Backbone Model
var Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: ''
    }
});

// Backbone Collection
var Blogs = Backbone.Collection.extend({});

// instantiate a Collection
var blogs = new Blogs();

// Backbone View for one blog
var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function() {
        this.template = _.template($('.blogs-list-template').html())
    },
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel': 'cancel',
        'click .delete-blog': 'delete',
    },
    edit: function() {
        this.$('.edit-blog').hide();
        this.$('.delete-blog').hide();
        this.$('.update-blog').show();
        this.$('.cancel').show();

        const author = this.$('.author').html();
        const title = this.$('.title').html();
        const url = this.$('.url').html();

        this.$('.author').html(`<input type="text" class="form-control author-update" value="${author}" />`);
        this.$('.title').html(`<input type="text" class="form-control title-update" value="${title}" />`);
        this.$('.url').html(`<input type="text" class="form-control url-update" value="${url}" />`);
    },
    update: function() {
        this.model.set('author', $('.author-update').val());
        this.model.set('title', $('.title-update').val());
        this.model.set('url', $('.url-update').val());
    },
    cancel: function() {
        blogsView.render();
    },
    delete: function() {
        this.model.destroy();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// Backbone View for all blogs
var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function() {
        this.model.on('add', this.render, this);
        this.model.on('change', () => {
            setTimeout(() => {
                this.render();
            }, 30);
        }, this);
        this.model.on('remove', this.render, this);
    },
    render: function() {
        this.$el.html('');
        _.each(this.model.toArray(), (blog) => {
            this.$el.append(new BlogView({ model: blog }).render().$el);
        });

        return this;
    }
});

var blogsView = new BlogsView();

$(document).ready(function() {
    $('.add-blog').on('click', function() {
        var blog = new Blog({
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val()
        });

        $('.author-input').val('');
        $('.title-input').val('');
        $('.url-input').val('');

        blogs.add(blog);
    });
});