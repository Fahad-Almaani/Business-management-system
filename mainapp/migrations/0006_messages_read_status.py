# Generated by Django 4.1.6 on 2023-03-19 03:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0005_alter_profit_date_enterd'),
    ]

    operations = [
        migrations.AddField(
            model_name='messages',
            name='read_status',
            field=models.BooleanField(default=False),
        ),
    ]