# Stream Overlay

This module adds custom overlays to Foundry VTT for you to use on your stream.

## Installation

To install, import this [Manifest](https://raw.githubusercontent.com/Terocreep/streamoverlay/master/module.json) into your module browser.

## Usage

### Custom Overlay

> Provide an overlay to display rolls in a customizable maner

1. To start, open the `link generator` 

2. Then Select the options that you want on the overlay

3. Click the `Generate` button to generate the link of the overlay

4. Click the `Copy` button 

5. You have now a link to use. Put it as a `browser source` on `OBS` (or any streaming software that support browser sources)

6. Enjoy!

There are multiple settings :

| Name | Description |
|------|-------------|
| OnlyOne | Only one roll will be displayed at a time, the overlay will wait the disappearing of a roll to display the next one. |
| Users | Select the Users that you want the rolls to be displayed. If none are selected, any user will  be displayed |
| Actors | Select the Actors that you want the rolls to be displayed. If none are selected, any actor will  be displayed |
| Custom CSS | Apply a style for only one page. If not set, global style will be used. If set, both the global one and the cusom one will be used |
| Custom HTML | Apply a temlpate for only one page. If not set, global temlpate will be used, If set, only the custom one will be used |

Other infos :

- Custom CSS/HTML will create long links but add another level of customization.

- A link that work now will work tomorrow, you don't have to regenerate the links every time there is an update.

### Global styling and templating

> Provide a way to dynamically edit the style and template used for the overlays

| Name | Description |
|------|-------------|
| Custom CSS | Define the style for the overlays |
| Custom HTML | Define the template for the overlays |

### HTML Templating and CSS Styling

- Template :

You can define the layout to use to display a roll, you may use the provided variables. Any occurence of the variable will be replaced. The variable name should be put between `{` and `}` without spaces. The available variables are `username`, `actorname`, `roll_result`, `roll_formula`


- Style :

You can define the style to use on the template.

- Exemple 1 - basic overlay :

Template

```html
<div class="box">
    <div class="header">{username}</div>
    <div class="content">{roll_result}</div>
</div>
```
 
Style

```css
.box{
    color: black;
    margin: 3px;
    padding: 5px;
    background-color: #E0DFD5;
    border: 2px solid #6F6C66;
    border-radius: 5px;
}
.content{
    text-align: center;
    background: rgba(0,0,0,0.1);
    border: 1px solid #999;
    border-radius: 3px;
}
```

- Exemple 2 - specific color for an user :

Template

```html
<div class="box">
    <div class="header {username}">{username}</div>
    <div class="content">{roll_result}</div>
</div>
```
 
Style, replace `user1` with the name of the user

```css
.user1{
    color: red;
}
.box{
    color: black;
    margin: 3px;
    padding: 5px;
    background-color: #E0DFD5;
    border: 2px solid #6F6C66;
    border-radius: 5px;
}
.content{
    text-align: center;
    background: rgba(0,0,0,0.1);
    border: 1px solid #999;
    border-radius: 3px;
}
```


## Changelog

Check the [Changelog](https://github.com/Terocreep/streamoverlay/blob/master/CHANGELOG.md)

## Feature Requests

If there is anything related to this module that you want or that might be usefull, feel free to create a feature request or message me on Discord!

## Feedbacks

If there is anything that you think could be better feel free to tell me. I read all constructive criticism.
