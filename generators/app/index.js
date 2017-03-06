'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.extend({
    prompting: function() {
        this.log(yosay('Welcome to the ' + chalk.magenta('generator-spigot') + ' generator!'));
        var done = this.async();
        var prompts = [{
            type: 'input',
            name: 'artifactName',
            message: 'What should the project be called?',
            default: this.appname
        }, {
            type: 'input',
            name: 'groupName',
            message: 'What is the group name? e.g. net.bancey',
            default: ''    
        }, {
            type: 'confirm',
            name: 'git',
            message: 'Setup a git repository?',
            default: 'Y'
        }, {
            type: 'input',
            name: 'gitRepo',
            message: 'Please provide a remote git repository (You can do this later)',
            default: '',
            when: function(answers) {
                return answers.git;
            }
        }];

        return this.prompt(prompts).then(function (props) {
            this.props = props;
            done();
        }.bind(this));
    },

    writing: function() {
        this.fs.copyTpl(this.templatePath('_gradle_config/_settings.gradle'), this.destinationPath('settings.gradle'), {artifactName: this.props.artifactName});
        this.fs.copyTpl(this.templatePath('_gradle_config/_build.gradle'), this.destinationPath('build.gradle'), {groupName: this.props.groupName});
        this.fs.copy(this.templatePath('_gradle_as_is/**/*.*'), this.destinationPath(''));

        this.fs.copyTpl(this.templatePath('src/main/resources/plugin.yml'), this.destinationPath('src/main/resources/plugin.yml'), {groupName: this.props.groupName, artifactName: this.props.artifactName});
        var groupName = this.props.groupName;
        this.fs.copyTpl(this.templatePath('src/main/java/_group/_name/Main.java'), this.destinationPath('src/main/java/' + groupName.split(".")[0] + '/' + groupName.split(".")[1] + '/Main.java'), {groupName: this.props.groupName});
        this.fs.copyTpl(this.templatePath('src/test/_group/_name/MainTest.java'), this.destinationPath('src/test/' + groupName.split(".")[0] + '/' + groupName.split(".")[1] + '/MainTest.java'), {groupName: this.props.groupName});
    },

    output: function() {
        this.log(yosay('Thank you for using the ' + chalk.magenta('generator-spigot') + ' generator!'));
    }
});
