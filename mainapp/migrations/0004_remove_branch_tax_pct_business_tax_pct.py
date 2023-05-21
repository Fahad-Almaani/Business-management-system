# Generated by Django 4.1.6 on 2023-03-11 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0003_branch_tax_pct'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='branch',
            name='tax_pct',
        ),
        migrations.AddField(
            model_name='business',
            name='tax_pct',
            field=models.IntegerField(default=5),
        ),
    ]
