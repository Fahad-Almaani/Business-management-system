# Generated by Django 4.1.6 on 2023-03-07 04:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='expence',
            name='note',
        ),
    ]
