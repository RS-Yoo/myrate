﻿/**
 * Authors:   Alyse  Palsulich, Nicholas Gonzalez
 * Date:      11-16-2022
 * Course:    CS 4500, University of Utah, School of Computing
 * Copyright: CS 4500 and Alyse Palsulich, Nicholas Gonzalez, Justin Springborn, and Rosemary Yoo - This work may not be copied for use in Academic Coursework.
 *
 * I, Alyse Palsulich, Nicholas Gonzalez, Justin Springborn, and Rosemary Yoo,
 * certify that I wrote this code from scratch and did not copy it in part or 
 * whole from another source. Any references used in the completion of the assignment 
 * are cited in my README file and in the appropriate method header.
 *
 * File Contents
 * Model class for Movies Models. Extends IdentitiyUser class.
 */

namespace myrate_backend.Models
{
    public class Movies
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Director { get; set; }
        public DateOnly ReleaseDate { get; set; }
        public string summary { get; set; }
        // will add later, not to be implemeneted currently
        public List<string>? Actors { get; set; }
    }
}
