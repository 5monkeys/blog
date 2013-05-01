Django Viewlet
==============

:date: 2012-11-17 12:00
:tags: cache, template, optimizing
:category: django
:slug: django-viewlet
:author: Jonas Lundberg
:summary: Render template parts with extended cache control.


Find and analyze your problem
-----------------------------
A common problem when building web sites is that they tend to load slower and slower when the user base starts to grow,
and the requests/sec has to reach the next level.

These slow responses often depend on third party resources like a database or external service api's.
A great solution to improve page speed is to start caching slow parts of your logic and context.

But, before doing this you should always try to optimize the code that are about to be cached, you don't want to "hide" dirty code.

A few simple tips:

* try to decrease number of database queries
* make sure your slow or common queries are well indexed
* if using Django's ORM, use .values() or .values_list() to fetch less data and decrease cpu/mem.
* fine-tune your resources to line up with your current state of load and memory

So, just by caching your way out doesn't mean that your code won't be run, and still needs to perform well.
The next step is to figure out *what* to cache, *when* and *how* to trigger it.

Django's cache framework
________________________
Django has a few built in solutions for caching, per-site, per-view and template fragment caching.
Per-site and per-view are great tools when your response is anonymous, not containing any user specific stuff
and if your content doesn't get updated frequently.

Since these two will cache your whole response they are quite hard to use on highly dynamic pages. ``Varnish`` could be a better alternative.

Template fragment cache on the other hand is a good way to cache parts of your template that are equal to every user like a menu, sidebar, footer etc.

Caching the right stuff
_______________________
This seems to be an easy and good way to solve your problem, but what if the "slow" context variable, like a queryset, already have been executed in the view resulting an even slower page,
since you're not caching the slow stuff but actually adding one more resource to the page, the cache it self.
This can be solved by using Django's inclusion tags and move context related code from your view to a new tag and wrap that with a cache tag, quite messy.

Timeouts
________
Another problem when caching is that you mostly need to set a timeout, for example using the cache tag and set the timeout to 300 seconds,
resulting in your actual code to be re-run every 5 minute. The issue here lies in the re-run part. There's no async stuff going on here,
meaning that one of your regular requests will be the one hitting the timeout and causing the code to run once again and re-fill the cache.
A dirty "solution" to this is to brute-force loading your site with a cron-like utility and at a higher frequency than your cache timeouts.

Solving the problem
-------------------
In my opinion, this is not a good way to cache your site, because the speed will vary and the end user will take the hit and trigger your data to reload.

This is why we wrote ``Django Viewlet``.

A viewlet is almost like a function based django view, taking a template context as first argument instead of request.
The result of a viewlet is cached and, best of all, able to be refreshed.
It's recommended to set your viewlet to never timeout, meaning cache forever.

Usage
_____

Place your viewlets in ``viewlets.py`` or existing ``views.py`` in your django app directory.

.. code-block:: python

    from django.template.loader import render_to_string
    from viewlet import viewlet

    @viewlet
    def hello_user(context, name):
        return render_to_string('hello_user.html', {'name': name})


You can then render the viewlet with the ``viewlet`` template tag:

.. code-block:: html

    {% load viewlets %}
    <p>{% viewlet hello_user request.user.username %}</p>


Normally you'll return a rendered template from your viewlet,
but you can also return a context if you need your viewlet template to be rendered on every request, causing the context itself to be cached instead.

Refreshing viewlets
___________________

A cached viewlet can be re-rendered and updated behind the scenes with ``viewlet.refresh``

.. code-block:: python

    import viewlet
    viewlet.refresh('hello_user', 'monkey')


Content on your site will always get updated by some kind of action, like saving a model or a celery task being executed, modifying some data.

Try to find these triggers and then hook in your viewlet.refresh there.

Django signals is a good way of doing this, by either connecting to an existing one like post_save, or dispatching your own.

.. code-block:: python

    @viewlet(timeout=None)
    def product_teaser(context, id):
        product = get_context_object(Product, id, context)
        return render_to_string('product_teaser.html', {'product': product})

    def refresh_product_teaser(instance, **kwargs):
        viewlet.refresh('product_teaser', instance.id)

    post_save.connect(refresh_product_teaser, Product)


Sum up
------
This will increase your speed, always showing nearly live data and gaining control over the cached parts of your templates.
No more stalling pages or suffering end users.

Clone, fork or read the full documentation at: https://github.com/5monkeys/django-viewlet


.. image:: https://travis-ci.org/5monkeys/django-viewlet.png?branch=master
    :target: http://travis-ci.org/5monkeys/django-viewlet
