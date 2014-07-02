Title: Zoom/Enhance
Date: 2014-07-01 12:00
Tags: zoom, enhance, javascript, html, ui
Category: jquery
Slug: zoomenhance
Author: Ludvig Ericson
Summary: A zooming, enhancing lens for the Web

<style>

  .zoomenhance-overlay {
    background-color: #ccc;
    background-repeat: no-repeat;
    width: 200px;
    height: 200px;
    cursor: none;
    display: block;
    position: absolute;
    border: 2px solid white;
    border-radius: 100px;
    box-shadow: #777 0px 0px 10px,
                black 0px 0px 8px inset,
                white 0px 0px 20px inset;

    /* Makes own render layer -- snappy as hell! */
    -webkit-transform: translatez(0);
    -o-transform: translatez(0);
    transform: translatez(0);
  }

</style>

<script src="js/jquery-1.9.1.min.js"></script>
<script src="js/jquery.zoomenhance.js"></script>

<script>
    $(function() {
      $('img.demo-native').zoomenhance({ manualCss: true });
      $('.magazine-covers img').zoomenhance({ manualCss: true,
                                              zoomFactor: 3 });
    });
</script>

<iframe width="853" height="480" src="http://www.youtube.com/embed/LhF_56SxrGk?rel=0" frameborder="0" allowfullscreen></iframe>

Zoom/enhance is a jQuery plugin that adds a zooming lens to high-resolution images.

[More information on GitHub](http://github.com/5monkeys/zoomenhance/).

## Original usecase

We wanted to show magazine covers and sometimes the user would need to "read
the fine print," this proved challenging because we could either blow up the
image size so the rest of the interface suffered just to show a tiny text, or
we could do what we did: a magnifying glass. Try to find the issue number or
date in the magazine covers below!

<div class="magazine-covers">
  <img width="350" src="http://www.webdesignburn.com/wp-content/uploads/2011/12/Angelina.Jolie_.MagazineCover.jpg">
  <img width="350" src="http://slangrap.files.wordpress.com/2010/03/vibe02_treycvr.jpg">
  <img width="350" src="http://assets.nydailynews.com/polopoly_fs/1.1401122.1401897053!/img/httpImage/image.jpg_gen/derivatives/gallery_1200/rolling-stone.jpg">
  <img width="350" src="http://www.imore.com/sites/imore.com/files/images/stories/2010/04/time-100401.png">
</div>

## Fractal broccoli

<img width="500" src="http://static.parade.condenast.com/wp-content/uploads/2013/06/romanesco-ftr.jpg" class="demo-native">
