<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['branch_id', 'title', 'amount', 'expense_date'];
}
